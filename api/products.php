<?php
/**
 * api/products.php
 * Endpoint REST para CRUD e Consulta de Produtos no Banco MySQL.
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$category = $_GET['category'] ?? null;
$featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;

switch ($method) {
    case 'GET':
        if (!$pdo) {
            sendJson(['status' => 'offline', 'products' => []], 200);
        }

        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
                $stmt->execute([$id]);
                $product = $stmt->fetch();

                if (!$product) {
                    sendJson(['error' => 'Produto não encontrado'], 404);
                }

                $product['category'] = $product['category_id'];
                $product['formattedPrice'] = 'R$ ' . number_format((float)$product['price'], 2, ',', '.');
                $product['gallery'] = json_decode($product['gallery'] ?? '[]', true);
                $product['details'] = json_decode($product['details'] ?? '[]', true);

                sendJson(['success' => true, 'product' => $product]);
            } else {
                $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.active = 1";
                $params = [];

                if ($category && $category !== 'all') {
                    $sql .= " AND (p.category_id = ? OR p.subcategory_id = ?)";
                    $params[] = $category;
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
                    $p['category'] = $p['category_id'];
                    $p['price'] = (float)$p['price'];
                    $p['formattedPrice'] = 'R$ ' . number_format($p['price'], 2, ',', '.');
                    $p['gallery'] = json_decode($p['gallery'] ?? '[]', true);
                    $p['details'] = json_decode($p['details'] ?? '[]', true);
                }

                sendJson(['success' => true, 'count' => count($products), 'products' => $products]);
            }
        } catch (Exception $e) {
            sendJson(['error' => $e->getMessage()], 500);
        }
        break;

    case 'POST':
    case 'PUT':
        $body = getJsonBody();
        $prodId = $id ?: ($body['id'] ?? ('hc-' . substr(md5(uniqid()), 0, 6)));
        $name = trim($body['name'] ?? '');
        $categoryId = trim($body['category_id'] ?? ($body['category'] ?? 'moda-banho'));
        $subcategoryId = $body['subcategory_id'] ?? ($body['subcategory'] ?? null);
        $price = (float)($body['price'] ?? 0);
        $promotionalPrice = !empty($body['promotional_price']) ? (float)$body['promotional_price'] : null;
        $color = $body['color'] ?? 'Ouro Nobre';
        $image = $body['image'] ?? ($body['imageUrl'] ?? '');
        $badge = $body['badge'] ?? null;
        $description = $body['description'] ?? '';
        $featured = !empty($body['featured']) ? 1 : 0;
        $active = isset($body['active']) ? (int)$body['active'] : 1;
        $stockTotal = (int)($body['stock_total'] ?? 10);
        $gallery = json_encode($body['gallery'] ?? []);
        $details = json_encode($body['details'] ?? []);

        if (empty($name) || $price <= 0) {
            sendJson(['error' => 'Nome e Preço válidos são obrigatórios.'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO products (id, name, category_id, subcategory_id, price, promotional_price, color, image, gallery, badge, description, details, featured, active, stock_total)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        category_id = VALUES(category_id),
                        subcategory_id = VALUES(subcategory_id),
                        price = VALUES(price),
                        promotional_price = VALUES(promotional_price),
                        color = VALUES(color),
                        image = VALUES(image),
                        gallery = VALUES(gallery),
                        badge = VALUES(badge),
                        description = VALUES(description),
                        details = VALUES(details),
                        featured = VALUES(featured),
                        active = VALUES(active),
                        stock_total = VALUES(stock_total)
                ");

                $stmt->execute([
                    $prodId,
                    $name,
                    $categoryId,
                    $subcategoryId,
                    $price,
                    $promotionalPrice,
                    $color,
                    $image,
                    $gallery,
                    $badge,
                    $description,
                    $details,
                    $featured,
                    $active,
                    $stockTotal
                ]);

                sendJson([
                    'success' => true,
                    'message' => 'Produto salvo com sucesso no banco MySQL!',
                    'product' => [
                        'id' => $prodId,
                        'name' => $name,
                        'category' => $categoryId,
                        'price' => $price,
                        'color' => $color,
                        'image' => $image,
                        'badge' => $badge
                    ]
                ], 200);
            } catch (Exception $e) {
                sendJson(['error' => 'Erro ao salvar no MySQL: ' . $e->getMessage()], 500);
            }
        } else {
            sendJson(['success' => true, 'message' => 'Salvo localmente (offline).', 'id' => $prodId]);
        }
        break;

    case 'DELETE':
        $prodId = $id ?: ($_GET['id'] ?? null);
        if (!$prodId) {
            sendJson(['error' => 'ID do produto é obrigatório para exclusão.'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
                $stmt->execute([$prodId]);
                sendJson(['success' => true, 'message' => 'Produto removido com sucesso do banco MySQL!']);
            } catch (Exception $e) {
                sendJson(['error' => 'Erro ao excluir do MySQL: ' . $e->getMessage()], 500);
            }
        } else {
            sendJson(['success' => true, 'message' => 'Produto removido localmente.']);
        }
        break;

    default:
        sendJson(['error' => 'Método HTTP não permitido'], 405);
}
