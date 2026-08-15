<?php
/**
 * api/heroes.php
 * Endpoint REST para Gerenciamento de Heros, Banners e Publicações no Banco MySQL.
 */
require_once __DIR__ . '/db.php';

if (!$pdo) {
    sendJson(['status' => 'offline', 'message' => 'Banco de dados MySQL não conectado. Usando fallback.'], 503);
}

$method = $_SERVER['REQUEST_METHOD'];
$pageId = $_GET['page_id'] ?? null;

switch ($method) {
    case 'GET':
        if ($pageId) {
            $stmt = $pdo->prepare("SELECT * FROM heroes WHERE page_id = ?");
            $stmt->execute([$pageId]);
            $hero = $stmt->fetch();
            if ($hero) {
                $hero['buttons'] = json_decode($hero['buttons'] ?? '[]', true);
                sendJson(['success' => true, 'hero' => $hero]);
            } else {
                sendJson(['error' => 'Hero não encontrada para esta página'], 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM heroes");
            $heroes = $stmt->fetchAll();
            $result = [];
            foreach ($heroes as $h) {
                $h['buttons'] = json_decode($h['buttons'] ?? '[]', true);
                $result[$h['page_id']] = $h;
            }
            sendJson(['success' => true, 'heroes' => $result]);
        }
        break;

    case 'POST':
    case 'PUT':
        $body = getJsonBody();
        $targetPageId = $pageId ?: ($body['page_id'] ?? null);

        if (!$targetPageId || empty($body['title'])) {
            sendJson(['error' => 'page_id e title são obrigatórios'], 400);
        }

        $buttons = json_encode($body['buttons'] ?? []);

        $stmt = $pdo->prepare("
            INSERT INTO heroes (page_id, badge, title, description, image_url, image_alt, type, buttons)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                badge = VALUES(badge),
                title = VALUES(title),
                description = VALUES(description),
                image_url = VALUES(image_url),
                image_alt = VALUES(image_alt),
                type = VALUES(type),
                buttons = VALUES(buttons)
        ");

        $stmt->execute([
            $targetPageId,
            $body['badge'] ?? null,
            $body['title'],
            $body['description'] ?? '',
            $body['image_url'] ?? '',
            $body['image_alt'] ?? '',
            $body['type'] ?? 'category',
            $buttons
        ]);

        sendJson(['success' => true, 'message' => 'Hero atualizada com sucesso!', 'page_id' => $targetPageId]);
        break;

    default:
        sendJson(['error' => 'Método HTTP não permitido'], 405);
}
