<?php
/**
 * db.php
 * Conexão com o Banco de Dados MySQL / MariaDB via PDO (Compatível com cPanel HostGator).
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurações do Banco de Dados na HostGator (cPanel)
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'rod38226_hotchili_db';
$dbUser = getenv('DB_USER') ?: 'rod38226_admin';
$dbPass = getenv('DB_PASS') ?: 'ROD21rigo';

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Se o banco ainda não estiver configurado (ex: rodando localmente sem MySQL),
    // a API responderá com aviso claro para fallback.
    $pdo = null;
    $dbError = $e->getMessage();
}

/**
 * Função utilitária para enviar respostas JSON padronizadas
 */
function sendJson($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Função para obter o corpo da requisição JSON
 */
function getJsonBody()
{
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

/**
 * Função de Segurança: Valida se a requisição possui um Token de Autenticação de Administrador válido
 */
function requireAdminAuth()
{
    global $pdo;

    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    
    $token = '';
    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
    } elseif (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $token = trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    }

    if (empty($token)) {
        sendJson(['error' => 'Acesso não autorizado. Token de autenticação administrativo não fornecido.'], 401);
    }

    if ($pdo) {
        try {
            // Verificar token gravado no banco de dados nas configurações
            $stmt = $pdo->prepare("SELECT key_value FROM settings WHERE key_name = 'admin_session_token'");
            $stmt->execute();
            $storedToken = $stmt->fetchColumn();

            if (!empty($storedToken) && hash_equals($storedToken, $token)) {
                return true;
            }

            // Alternativamente, verificar token na tabela admin_users se coluna existir
            $usrStmt = $pdo->prepare("SELECT id FROM admin_users WHERE session_token = ?");
            $usrStmt->execute([$token]);
            if ($usrStmt->fetch()) {
                return true;
            }

            // Se for token inicial gerado e token não bater, rejeita
            sendJson(['error' => 'Sessão inválida ou expirada. Realize o login novamente no painel.'], 401);
        } catch (Exception $e) {
            // Se tabela de configurações não puder ser lida, verificar formato válido do token
            if (strlen($token) >= 16) {
                return true;
            }
            sendJson(['error' => 'Erro na validação de autenticação.'], 401);
        }
    }

    // Modo offline (sem banco MySQL ativo localmente)
    if (strlen($token) >= 16) {
        return true;
    }

    sendJson(['error' => 'Token de autenticação inválido.'], 401);
}

