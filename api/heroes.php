<?php
/**
 * api/heroes.php
 * Endpoint REST para Gerenciamento de Heros, Banners e Publicações no Banco MySQL.
 */
require_once __DIR__ . '/db.php';

$defaultHeroes = [
    'home' => [
        'page_id' => 'home',
        'type' => 'home',
        'badge' => 'Coleção Alto Verão 2026',
        'title' => 'Sinta a Efervescência do Verão',
        'description' => 'O luxo autoral brasileiro esculpido em peças atemporais com metais banhados a ouro, texturas manuais e proteção solar de alta tecnologia.',
        'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuChO5ac7GM05feevK3AKK8ckQsGI8zyLHcWYSqe_79EJZdlx2wmGqC0y2R5n77qB43BCg8ZaumkWAFY-A4K0FwYdpstPtOZjV46hdS0LsCEGjlhKsFbZNKQ2ARh25p94SEXswwCKW0I-4HmyMCeafYQNTl4ip2xdVkoCVGNnv_P04FItAfYej34n9I4C63sDpmC_8_psqPCjX9kK4BnHkcrXq_i7I7Dx437I6J2xxT6FgW-6WFy652D',
        'image_alt' => 'Modelo em praia paradisíaca ao pôr do sol vestindo biquíni de alta costura com acabamentos em ouro e iluminação dourada.'
    ],
    'moda-banho' => [
        'page_id' => 'moda-banho',
        'type' => 'category',
        'badge' => 'Coleção Principal',
        'title' => 'Moda Banho — Na Água',
        'description' => 'Biquínis cortininha, maiôs estruturados e sungas adultas esculpidos em tecidos nobres com proteção UV50+.',
        'image_url' => 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw',
        'image_alt' => 'Água turquesa e brilho do sol tropical'
    ],
    'resort-sunset' => [
        'page_id' => 'resort-sunset',
        'type' => 'category',
        'badge' => 'Alta Alfaiataria Resort',
        'title' => 'Resort & Sunset',
        'description' => 'Elegância pós-praia: saídas de crochê, calças de tricô, saias fluidas e vestidos sofisticados.',
        'image_url' => 'https://lh3.googleusercontent.com/aida/AP1WRLv4W3Z64vAy94UMXJw6ZN2DhvWmGPgC1hJaFAKDi1Xy3tmZ0wVUt-fyCVOFmvv2IJ00ZO4LD6NwBrDqNL8qW5g20-WWfDiKraHMBLnY5_amVoApFfrjyaK1wAU_3cPdHEpy05mpVmA85TCf6mh3TBlok9fcSf6LhD5wVOkbvsSq_QmfzvjrFle6XIV2r5fxCt0WjRnJjgsXEulOjz_qCb5Sr3EHg28uSopHLrZBzoNi6QLSg8nF8amaPw',
        'image_alt' => 'Pôr do sol dourado na praia com ondas suaves e areia quente.'
    ],
    'kids' => [
        'page_id' => 'kids',
        'type' => 'category',
        'badge' => 'Conforto & Diversão',
        'title' => 'Hot Chili Kids',
        'description' => 'O verão dos pequenos com o máximo de conforto, tecidos com toque macio e proteção solar UPF50+.',
        'image_url' => 'https://lh3.googleusercontent.com/aida/AP1WRLulZQtlsr7dP3iqmxd3se9f4tv7uIj11or3l9_6UG965S-7dnrklEwSKaBFO0fmipYBL-5RmKhHacDqz2bzJQofJrkPpXF8GkNXuP2tioiAv7UbHL0EOcbmfD2DH2STluhoCLosAhFLHMbI6fs7sqshPQg8AlGuSfgqqRFKKFjiAtGq6fu9iGTzY1L4SEq-fgpUSQKth1TG-QeNaOcwo4Fpf3LdXdpQTyqjvmETzBloO5aTz7OKWmxsqg',
        'image_alt' => 'Crianças brincando na praia ao sol com roupas de banho confortáveis e proteção UV.'
    ],
    'acessorios' => [
        'page_id' => 'acessorios',
        'type' => 'category',
        'badge' => 'Detalhes de Luxo',
        'title' => 'Acessórios & Joias',
        'description' => 'Bolsas de palha trançada, cangas de seda pura, chapéus artesanais e joias em búzios banhadas a ouro 18k.',
        'image_url' => 'https://lh3.googleusercontent.com/aida/AP1WRLvLdFDjrN1Ch0I0sETtUo3lAAJy0Qi9wmyvtcvNvs8PwcKuUvg1Rw8AlDcWc1nhAujPPjHsbZiz7DOmkPkarF0XNrBK9Lg5ULwGeyo_rRgsm0ZrWoNReySdGKdiz-UtMdUzWvBXAp7Oz5_73v-sCIa2TkyNaI3yYCG8yUylTG1tjPBu4A7r_A2a_R_9hzVZojcrilI_mizn3eNpgZtgcT7l019ZRJuWipAAz3-a6--k-BKflAPQq-gbeg4',
        'image_alt' => 'Bolsa de palha e acessórios de moda praia artesanais.'
    ],
    'protecao-solar' => [
        'page_id' => 'protecao-solar',
        'type' => 'category',
        'badge' => 'Tecnologia Têxtil UPF50+',
        'title' => 'Proteção Solar',
        'description' => 'Tecnologia têxtil de ponta com bloqueio permanente de até 98% dos raios UVA e UVB para toda a família.',
        'image_url' => 'https://lh3.googleusercontent.com/aida/AP1WRLulZQtlsr7dP3iqmxd3se9f4tv7uIj11or3l9_6UG965S-7dnrklEwSKaBFO0fmipYBL-5RmKhHacDqz2bzJQofJrkPpXF8GkNXuP2tioiAv7UbHL0EOcbmfD2DH2STluhoCLosAhFLHMbI6fs7sqshPQg8AlGuSfgqqRFKKFjiAtGq6fu9iGTzY1L4SEq-fgpUSQKth1TG-QeNaOcwo4Fpf3LdXdpQTyqjvmETzBloO5aTz7OKWmxsqg',
        'image_alt' => 'Camadas de tecido com proteção solar de alta tecnologia e fios tecnológicos.'
    ],
    'guia-tamanhos' => [
        'page_id' => 'guia-tamanhos',
        'type' => 'simple',
        'badge' => 'Caimento Impecável',
        'title' => 'Guia de Tamanhos & Medidas',
        'description' => 'Descubra a numeração perfeita para valorizar suas curvas e garantir o conforto absoluto da alta moda praia.',
        'image_url' => '',
        'image_alt' => ''
    ],
    'atendimento' => [
        'page_id' => 'atendimento',
        'type' => 'simple',
        'badge' => 'Experiência Exclusiva',
        'title' => 'Atendimento & Concierge VIP',
        'description' => 'Nossa equipe de consultoria e atendimento personalizado está à sua total disposição para assegurar uma jornada de compra impecável e inesquecível.',
        'image_url' => '',
        'image_alt' => ''
    ]
];

$method = $_SERVER['REQUEST_METHOD'];
$pageId = $_GET['page_id'] ?? null;

switch ($method) {
    case 'GET':
        $result = $defaultHeroes;

        if ($pdo) {
            try {
                if ($pageId) {
                    $stmt = $pdo->prepare("SELECT * FROM heroes WHERE page_id = ?");
                    $stmt->execute([$pageId]);
                    $hero = $stmt->fetch();
                    if ($hero) {
                        $hero['buttons'] = json_decode($hero['buttons'] ?? '[]', true);
                        sendJson(['success' => true, 'hero' => $hero]);
                    }
                } else {
                    $stmt = $pdo->query("SELECT * FROM heroes");
                    $heroes = $stmt->fetchAll();
                    foreach ($heroes as $h) {
                        $h['buttons'] = json_decode($h['buttons'] ?? '[]', true);
                        $result[$h['page_id']] = array_merge($result[$h['page_id']] ?? [], $h);
                    }
                }
            } catch (Exception $e) {}
        }

        if ($pageId) {
            sendJson(['success' => true, 'hero' => $result[$pageId] ?? null]);
        } else {
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
        $badge = $body['badge'] ?? '';
        $title = $body['title'] ?? '';
        $description = $body['description'] ?? '';
        $imageUrl = $body['imageUrl'] ?? ($body['image_url'] ?? '');
        $imageAlt = $body['imageAlt'] ?? ($body['image_alt'] ?? '');
        $type = $body['type'] ?? 'category';

        if ($pdo) {
            try {
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
                    $badge,
                    $title,
                    $description,
                    $imageUrl,
                    $imageAlt,
                    $type,
                    $buttons
                ]);
            } catch (Exception $e) {}
        }

        sendJson([
            'success' => true,
            'message' => "Hero da página '{$targetPageId}' salva com sucesso!"
        ]);
        break;

    default:
        sendJson(['error' => 'Método não permitido'], 405);
        break;
}
