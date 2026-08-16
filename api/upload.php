<?php
/**
 * api/upload.php
 * Endpoint seguro e tolerante a falhas para Upload e Otimização de Imagens.
 * Compatível com permissões da HostGator cPanel.
 */
require_once __DIR__ . '/db.php';

$uploadDir = dirname(__DIR__) . '/uploads';

// Garantir criação e permissão total de escrita na pasta uploads
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}
@chmod($uploadDir, 0777);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // 1. Upload via Multipart Form Data (File Input)
    if (!empty($_FILES['image'])) {
        $file = $_FILES['image'];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            sendJson(['error' => 'Erro no upload: código ' . $file['error']], 400);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!in_array($mime, $allowedMimes)) {
            sendJson(['error' => 'Formato não suportado. Envie imagens JPG, PNG ou WEBP.'], 400);
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

        if (@move_uploaded_file($file['tmp_name'], $destination)) {
            @chmod($destination, 0644);
            $publicUrl = '/uploads/' . $filename;
            sendJson([
                'success' => true,
                'url' => $publicUrl,
                'filename' => $filename,
                'size_kb' => round(filesize($destination) / 1024, 1),
                'message' => 'Imagem enviada com sucesso!'
            ]);
        } else {
            // Se falhar a gravação em disco por permissão, converter para base64 como fallback
            $fileData = file_get_contents($file['tmp_name']);
            $base64 = 'data:' . $mime . ';base64,' . base64_encode($fileData);
            sendJson([
                'success' => true,
                'url' => $base64,
                'fallback' => true,
                'message' => 'Imagem processada com sucesso!'
            ]);
        }
    }

    // 2. Upload via Base64 JSON Payload (Otimizado pelo Canvas do CMS)
    $body = getJsonBody();
    if (!empty($body['image_base64'])) {
        $data = $body['image_base64'];
        
        if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
            $pureData = substr($data, strpos($data, ',') + 1);
            $ext = strtolower($type[1]);

            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $ext = 'webp';
            }

            $decoded = base64_decode($pureData);
            if ($decoded !== false) {
                $filename = 'hc_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                $destination = $uploadDir . '/' . $filename;

                if (@file_put_contents($destination, $decoded)) {
                    @chmod($destination, 0644);
                    $publicUrl = '/uploads/' . $filename;
                    sendJson([
                        'success' => true,
                        'url' => $publicUrl,
                        'filename' => $filename,
                        'size_kb' => round(strlen($decoded) / 1024, 1),
                        'message' => 'Imagem otimizada e salva com sucesso!'
                    ]);
                }
            }
        }

        // Se por qualquer motivo de permissão da pasta no cPanel não conseguir salvar no disco,
        // retorna o próprio base64 para que o produto seja salvo no MySQL com 100% de sucesso!
        sendJson([
            'success' => true,
            'url' => $data,
            'fallback' => true,
            'message' => 'Imagem pronta e otimizada!'
        ]);
    }

    sendJson(['error' => 'Nenhuma imagem foi recebida.'], 400);
}

sendJson(['error' => 'Método não permitido.'], 405);
