<?php
/**
 * api/test.php
 * Script de Diagnóstico e Verificação de Saúde da Conexão com o MySQL na HostGator.
 * Acesse: https://seudominio.com.br/api/test.php
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'rod38226_hotchili_db';
$dbUser = getenv('DB_USER') ?: 'rod38226_admin';
$dbPass = getenv('DB_PASS') ?: 'ROD21rigo';

$status = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'database_config' => [
        'host' => $dbHost,
        'database' => $dbName,
        'user' => $dbUser,
        'pass_configured' => !empty($dbPass)
    ],
    'connection_status' => 'unknown',
    'tables_found' => [],
    'products_count' => 0,
    'heroes_count' => 0,
    'message' => ''
];

try {
    $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    
    $status['connection_status'] = 'SUCCESS';
    $status['message'] = 'Conexão com o banco de dados MySQL realizada com sucesso!';

    // Verificar tabelas existentes
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $status['tables_found'] = $tables;

    // Verificar produtos
    if (in_array('products', $tables)) {
        $pStmt = $pdo->query("SELECT COUNT(*) as count FROM products");
        $status['products_count'] = (int)$pStmt->fetch()['count'];
    }

    // Verificar heros
    if (in_array('heroes', $tables)) {
        $hStmt = $pdo->query("SELECT COUNT(*) as count FROM heroes");
        $status['heroes_count'] = (int)$hStmt->fetch()['count'];
    }

    // Se o banco estiver vazio (tabelas não criadas ainda), auto-executar o schema!
    if (empty($tables)) {
        $schemaPath = __DIR__ . '/schema.sql';
        if (file_exists($schemaPath)) {
            $sql = file_get_contents($schemaPath);
            $pdo->exec($sql);
            $status['auto_install'] = 'Tabelas criadas e populadas automaticamente a partir do schema.sql!';
            
            // Recontar
            $stmt = $pdo->query("SHOW TABLES");
            $status['tables_found'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
        }
    }

} catch (PDOException $e) {
    $status['connection_status'] = 'ERROR';
    $status['error_code'] = $e->getCode();
    $status['error_details'] = $e->getMessage();
    $status['message'] = 'Falha ao conectar ao MySQL. Verifique se o banco e usuário foram criados no cPanel e se o usuário tem privilégios totais.';
}

echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
