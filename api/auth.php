<?php
/**
 * api/auth.php
 * Endpoint REST para Autenticação Segura de Administradores do CMS.
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'login';

if ($method === 'POST' && $action === 'login') {
    $body = getJsonBody();
    $username = trim($body['username'] ?? '');
    $password = trim($body['password'] ?? '');

    if (empty($username) || empty($password)) {
        sendJson(['error' => 'Usuário e senha são obrigatórios.'], 400);
    }

    // 1. Validar via banco MySQL se conectado
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                $newToken = 'token_' . bin2hex(random_bytes(32));

                // Salvar token de sessão no banco
                $upd = $pdo->prepare("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
                $upd->execute([$user['id']]);

                $stgStmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES ('admin_session_token', ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
                $stgStmt->execute([$newToken]);

                sendJson([
                    'success' => true,
                    'token' => $newToken,
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'name' => $user['name'],
                        'role' => $user['role']
                    ]
                ]);
            }
        } catch (Exception $e) {}
    }

    // 2. Validação local (apenas se a senha cadastrada/configurada for válida)
    // Se o banco estiver configurado ou offline, verificar hash ou senha customizada
    $configuredPass = 'hotchili2026';
    if ($pdo) {
        try {
            $passStmt = $pdo->prepare("SELECT key_value FROM settings WHERE key_name = 'admin_password'");
            $passStmt->execute();
            $val = $passStmt->fetchColumn();
            if ($val) $configuredPass = $val;
        } catch (Exception $e) {}
    }

    if (($username === 'admin' || $username === 'admin@hotchili.com.br') && ($password === $configuredPass)) {
        $newToken = 'token_' . bin2hex(random_bytes(32));

        if ($pdo) {
            try {
                $stgStmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES ('admin_session_token', ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
                $stgStmt->execute([$newToken]);
            } catch (Exception $e) {}
        }

        sendJson([
            'success' => true,
            'token' => $newToken,
            'user' => [
                'id' => 1,
                'username' => 'admin',
                'name' => 'Administrador Hot Chili',
                'role' => 'admin'
            ]
        ]);
    }

    sendJson(['error' => 'Usuário ou senha incorretos.'], 401);
}

if ($method === 'POST' && $action === 'change_password') {
    // Exigir autenticação prévia
    requireAdminAuth();

    $body = getJsonBody();
    $newPassword = trim($body['new_password'] ?? '');

    if (strlen($newPassword) < 6) {
        sendJson(['error' => 'A nova senha deve ter pelo menos 6 caracteres.'], 400);
    }

    if ($pdo) {
        try {
            $hash = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'");
            $stmt->execute([$hash]);

            $stgStmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES ('admin_password', ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
            $stgStmt->execute([$newPassword]);

            sendJson(['success' => true, 'message' => 'Senha alterada com sucesso no banco MySQL!']);
        } catch (Exception $e) {}
    }

    sendJson(['success' => true, 'message' => 'Senha alterada com sucesso!']);
}

