<?php
/**
 * api/products.php
 * Endpoint REST para CRUD e Consulta de Produtos no Banco MySQL.
 */
require_once __DIR__ . '/db.php';

if (!$pdo) {
    sendJson(['status' => 'offline', 'message' => 'Banco de dados MySQL não conectado. Usando mock/localStorage.', 'error' => $dbError ?? ''], 503);
}

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$category = $_GET['category'] ?? null;
$featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if (!$product) {
                sendJson(['error' => 'Produto não encontrado'], 404);
            }

            // Buscar variações de estoque
            $varStmt = $pdo->prepare("SELECT size, stock_quantity, sku FROM product_variants WHERE product_id = ?");
            $varStmt->execute([$id]);
            $product['variants'] = $varStmt->fetchAll();
            $product['gallery'] = json_decode($product['gallery'] ?? '[]', true);
            $product['details'] = json_decode($product['details'] ?? '[]', true);

            sendJson(['success' => true, 'product' => $product]);
        } else {
            $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.active = 1";
            $params = [];

            if ($category) {
                $sql .= " AND p.category_id = ?";
                $params[] = $category;
            }
            if ($featured !== null) {
                $sql .= " AND p.featured = ?";
                $params[] = $featured;
            }

            $sql .= " ORDER BY p.created_at DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();

            foreach ($products as &$p) {
                $p['gallery'] = json_decode($p['gallery'] ?? '[]', true);
                $p['details'] = json_decode($p['details'] ?? '[]', true);
            }

            sendJson(['success' => true, 'count' => count($products), 'products' => $products]);
        }
        break;

    case 'POST':
        $body = getJsonBody();
        if (empty($body['name']) || empty($body['price']) || empty($body['category_id'])) {
            sendJson(['error' => 'Campos obrigatórios ausentes (name, price, category_id).'], 400);
        }

        $prodId = $body['id'] ?: ('prod-' . uniqid());
        $gallery = json_encode($body['gallery'] ?? []);
        $details = json_encode($body['details'] ?? []);

        $stmt = $pdo->prepare("
            INSERT INTO products (id, name, category_id, subcategory_id, price, promotional_price, color, image, gallery, badge, description, details, featured, active, stock_total, weight_kg, width_cm, height_cm, length_cm)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $prodId,
            $body['name'],
            $body['category_id'],
            $body['subcategory_id'] ?? null,
            $body['price'],
            $body['promotional_price'] ?? null,
            $body['color'] ?? 'Ouro Nobre',
            $body['image'] ?? '',
            $gallery,
            $body['badge'] ?? null,
            $body['description'] ?? '',
            $details,
            !empty($body['featured']) ? 1 : 0,
            isset($body['active']) ? (int)$body['active'] : 1,
            $body['stock_total'] ?? 10,
            $body['weight_kg'] ?? 0.300,
            $body['width_cm'] ?? 20,
            $body['height_cm'] ?? 10,
            $body['length_cm'] ?? 25
        ]);

        // Inserir variações de tamanho
        if (!empty($body['variants']) && is_array($body['variants'])) {
            $vStmt = $pdo->prepare("INSERT INTO product_variants (product_id, size, stock_quantity) VALUES (?, ?, ?)");
            foreach ($body['variants'] as $variant) {
                $vStmt->execute([$prodId, $variant['size'], $variant['stock_quantity'] ?? 10]);
            }
        }

        sendJson(['success' => true, 'message' => 'Produto cadastrado com sucesso!', 'id' => $prodId], 201);
        break;

    case 'PUT':
        if (!$id) {
            sendJson(['error' => 'ID do produto é obrigatório para atualização.'], 400);
        }
        $body = getJsonBody();
        $gallery = json_encode($body['gallery'] ?? []);
        $details = json_encode($body['details'] ?? []);

        $stmt = $pdo->prepare("
            UPDATE products SET
                name = ?, category_id = ?, subcategory_id = ?, price = ?, promotional_price = ?,
                color = ?, image = ?, gallery = ?, badge = ?, description = ?, details = ?,
                featured = ?, active = ?, stock_total = ?
            WHERE id = ?
        ");

        $stmt->execute([
            $body['name'],
            $body['category_id'],
            $body['subcategory_id'] ?? null,
            $body['price'],
            $body['promotional_price'] ?? null,
            $body['color'] ?? '',
            $body['image'] ?? '',
            $gallery,
            $body['badge'] ?? null,
            $body['description'] ?? '',
            $details,
            !empty($body['featured']) ? 1 : 0,
            isset($body['active']) ? (int)$body['active'] : 1,
            $body['stock_total'] ?? 10,
            $id
        ]);

        sendJson(['success' => true, 'message' => 'Produto atualizado com sucesso!']);
        break;

    case 'DELETE':
        if (!$id) {
            sendJson(['error' => 'ID do produto é obrigatório para exclusão.'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        sendJson(['success' => true, 'message' => 'Produto removido com sucesso!']);
        break;

    default:
        sendJson(['error' => 'Método HTTP não permitido'], 405);
}
