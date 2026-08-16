<?php
/**
 * api/upload.php
 * Endpoint seguro para Upload e Otimização de Imagens no Servidor (HostGator cPanel).
 * Salva na pasta /uploads/ e retorna a URL pública absoluta/relativa.
 */
require_once __DIR__ . '/db.php';

$uploadDir = dirname(__DIR__) . '/uploads';

// Criar pasta uploads se não existir
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // 1. Upload via Multipart Form Data (File Input)
    if (!empty($_FILES['image'])) {
        $file = $_FILES['image'];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            sendJson(['error' => 'Erro ao transferir arquivo: código ' . $file['error']], 400);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!in_array($mime, $allowedMimes)) {
            sendJson(['error' => 'Formato de imagem inválido. Aceitos: JPG, PNG, WEBP, GIF.'], 400);
        }

        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/svg+xml' => 'svg',
            default => 'jpg'
        };

        $filename = 'hc_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $destination = $uploadDir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $publicUrl = '/uploads/' . $filename;
            sendJson([
                'success' => true,
                'url' => $publicUrl,
                'filename' => $filename,
                'size_kb' => round(filesize($destination) / 1024, 1),
                'message' => 'Imagem enviada com sucesso!'
            ]);
        } else {
            sendJson(['error' => 'Não foi possível salvar o arquivo na pasta uploads.'], 500);
        }
    }

    // 2. Upload via Base64 JSON Payload (Imagens recortadas/redimensionadas no Canvas do CMS)
    $body = getJsonBody();
    if (!empty($body['image_base64'])) {
        $data = $body['image_base64'];
        
        if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
            $data = substr($data, strpos($data, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, webp

            if (!in_array($type, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $type = 'webp';
            }

            $data = base64_decode($data);
            if ($data === false) {
                sendJson(['error' => 'Falha ao decodificar imagem base64.'], 400);
            }

            $filename = 'hc_opt_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $type;
            $destination = $uploadDir . '/' . $filename;

            if (file_put_contents($destination, $data)) {
                $publicUrl = '/uploads/' . $filename;
                sendJson([
                    'success' => true,
                    'url' => $publicUrl,
                    'filename' => $filename,
                    'size_kb' => round(strlen($data) / 1024, 1),
                    'message' => 'Imagem otimizada e salva com sucesso!'
                ]);
            } else {
                sendJson(['error' => 'Erro ao salvar arquivo base64 no disco.'], 500);
            }
        } else {
            sendJson(['error' => 'Formato base64 inválido.'], 400);
        }
    }

    sendJson(['error' => 'Nenhum arquivo ou base64 recebido.'], 400);
}

sendJson(['error' => 'Método não permitido.'], 405);
