<?php
/**
 * db.php
 * Conexão com o Banco de Dados MySQL / MariaDB via PDO (Compatível com cPanel HostGator).
 */

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
