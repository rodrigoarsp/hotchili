<?php
/**
 * api/test.php
 * Script de Diagnóstico e Verificação de Saúde da Conexão com o MySQL na HostGator.
 * Auto-popula Categorias, Heroes e Catálogo de Produtos.
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
    'categories_count' => 0,
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

    // 1. Criar tabelas se não existirem
    $schemaPath = __DIR__ . '/schema.sql';
    if (file_exists($schemaPath)) {
        $sql = file_get_contents($schemaPath);
        $pdo->exec($sql);
    }

    // 2. Verificar tabelas existentes
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $status['tables_found'] = $tables;

    // 3. Contagens
    if (in_array('categories', $tables)) {
        $status['categories_count'] = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    }
    if (in_array('heroes', $tables)) {
        $status['heroes_count'] = (int)$pdo->query("SELECT COUNT(*) FROM heroes")->fetchColumn();
    }
    if (in_array('products', $tables)) {
        $status['products_count'] = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    }

    // 4. Se a tabela products tiver menos de 10 produtos, inserir o catálogo completo!
    if ($status['products_count'] < 10) {
        $initialProducts = [
            ['mb-01', 'Biquíni Ouro Solar', 'moda-banho', 'biquinis', 498.00, 'Textured Gold', 'https://lh3.googleusercontent.com/aida/AP1WRLvLdFDjrN1Ch0I0sETtUo3lAAJy0Qi9wmyvtcvNvs8PwcKuUvg1Rw8AlDcWc1nhAujPPjHsbZiz7DOmkPkarF0XNrBK9Lg5ULwGeyo_rRgsm0ZrWoNReySdGKdiz-UtMdUzWvBXAp7Oz5_73v-sCIa2TkyNaI3yYCG8yUylTG1tjPBu4A7r_A2a_R_9hzVZojcrilI_mizn3eNpgZtgcT7l019ZRJuWipAAz3-a6--k-BKflAPQq-gbeg4', 'Bestseller', 'Biquíni com detalhes metálicos banhados a ouro e textura exclusiva Sandswept.', 1],
            ['mb-02', 'Maiô Esculpido Chili', 'moda-banho', 'maios', 680.00, 'Obsidian Noir', 'https://lh3.googleusercontent.com/aida/AP1WRLtSY3lqnAzbeCAJDDEdMvuRrcR_NyyY-mJtOk2aoLZcvQM9jNTr1ruCU23r4AlUXyhqtSbSoXRXKGO9fRRoZ2TiTOvsOwG_jjHpiB1miefQW6mpmrSi-DiAKAqI0vl0y--yOq_DbA3kWZEkZiTr5zqmfaF4Ahr17JovhS4Kew5ydxwQfic4LpGYQFhLuVdgw_DJTSJHqd5TDkjznfTF2Xw_2tCavXkBIhdPlkYs5LbAhCi8WlWHxo7C-OQ', 'Exclusivo', 'Maiô de alta compressão com recortes anatômicos e decote dramático.', 1],
            ['mb-03', 'Top Cortininha Clássico', 'moda-banho', 'biquinis', 220.00, 'Branco Areia', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SF7Pwx1UV1JS3SUMUfxovEkHwvNTWstgngipcg3VCpjSyHoRyGNUtq7uGzQUEhloavjUVsF04UepRHj0IL5b_kG_R77qdxiwdNdaCsmBBnNnldOIHMaf5wPHLeM1x328ClUtvygmJEdvhakzPxH4VUCjERdgsjqJyqE6-S7rygvt2W2X9HTD_JneZ5SpsbYK3BcjedR57UitWEFr_VPDkYVj2wjVWzPQC5vnuL74I0RqQlf_6RbsUHc4a-_5ua-bjMkXec_twes', 'Novo', 'Top cortininha clássico com argolas douradas inoxidáveis.', 1],
            ['mb-04', 'Maiô Assimetria', 'moda-banho', 'maios', 550.00, 'Terracota', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RRlPwc-fls01iAbgbfPK1WjN-ZW-4fEEFHjdeHZ63MjkCZ7skhvQUES7S-aTMRZWsmUnqPtbciOgj5kO7YaqjEX7TJXKeCQPchjB6dJwN3AKwCwLS1H5V_3ZqNT1cKOn4-lrxUEFd5LA4_gQiRC7coDkG5DGnzHfcPhdKUiVT8plvz-pwQNwR71IQXk0IIQVxka7yzAstjfjbNnB3RVx2xfOc8nN8L8iBNkLCCSK0MURdGF9BBtmLt0E8G7jP1UjY3xOMZb7TZg', 'Destaque', 'Maiô ombro só com drapeado artesanal e caimento impecável.', 1],
            ['mb-05', 'Sunga Clássica Obsidian', 'moda-banho', 'sungas', 260.00, 'Obsidian Noir', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUI-cpSwPXz8uj-1eGv7qgscB63KOHVRQOvcCktGeK8kt-KNFe-tr1nih9zAW_jJCzlQoVGAZXlPAaAcfU1PDcmf3-SRw02S-g8kOa1OSNgYjs9mdOgx-05CEdXKI01YEf4K2d87Q5fpto8EARgV_iptJbzQ0c9ucyRVq5ibUQbpPUBfnRK9WKUFZ0sIihLrOwSvCy03GWXsskK_JLEDoqTs_YFifDyM-c4udh8J7hDVv0Eqak6cvsg0I9rcndDsKTSUEQqcdlICA', 'Bestseller', 'Sunga masculina com corte anatômico e tecido de secagem rápida com proteção solar.', 1],
            ['rs-01', 'Saída de Crochê Sunset', 'resort-sunset', 'croche', 740.00, 'Cru & Dourado', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeUaUSOrwUFV4FuDJKvx3cKiPtkVatoHk6wuLRn0qYeAaIYOrrXPGUvLFBYaWvfwuTBgh6FdXbvIdy9aRav8Er-aVpsLKaV_3gnJebU9prQoAdatqLugsmwb3P1_CXkZEx4wU4ViYz7qvybxUzazOeM_olRby8MrRAa4jDcH3MNuPkOxdaIGJ9bURDPSJ5SJeU0RAqC13tmHkhH04EMFGGhmfG8bkGcySpMvotLCd7T-RjdnIf28E2te7u_5KpOEj5yG1AB3K_YGI', 'Artesanal', 'Saída longa em crochê feito à mão com fios de seda e algodão egípcio.', 1],
            ['rs-02', 'Calça Pantalona Tricô', 'resort-sunset', 'calcas', 620.00, 'Sand Beige', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkm7-8Cby4ttDoSyKXnUq4EDqm4e4_STQVxzJwYeaVGBEhIqYUGqSedZrW-f3UmuKECihgCKna4GANZ-KD8aULUbN9FYm94NXWBOQwmgO8n5L3L0WTG-i-ErgnsN2-zqTDytEoRCKl7_IWUTiyfLkZOVSMVc5jhfb2-85sSXEw4xqtQ6N3LclFxUU9v_12F9lGU4tncGf2DkTTvbJ8q04xymVoqcmrCDtLG10HboifhbewYJB_czdoeIj6iojx_5x5iaWUlnEf-cM', 'Exclusivo', 'Calça pantalona leve com transparência sutil e cós elástico.', 1],
            ['rs-03', 'Vestido de Linho Riviera', 'resort-sunset', 'vestidos', 1250.00, 'Sand Beige', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoLOD4Ye861N1PWgijPwj09tSkoJNJZ__pxHUU7rikTxt3xPq7amw9opNOMab9y-9wqjx8M0ji7nxyQnFcseeVf91qAe9pqv4cKTiNTwS90fEURtceHUZ-g0M9vzgomie7CzzAKY6yhsMiP8vnEs7eT5LMvwH2vSFqsEHBPaEXtlMw2TU_qWnP-mt2ZBcZdxqXwBUw24fvLQt8jJX71Ahy9MNltJnpAuMd36Ci481G1mGMZOmOfjYvUv8YEWumanIBvOc4ew6kX5c', 'Luxo', 'Vestido longo em linho puro com modelagem fluida e acabamentos nobres.', 1],
            ['kd-01', 'Biquíni Infantil Estampa Coral', 'kids', 'biquinis-maios', 240.00, 'Coral Sun', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RRlPwc-fls01iAbgbfPK1WjN-ZW-4fEEFHjdeHZ63MjkCZ7skhvQUES7S-aTMRZWsmUnqPtbciOgj5kO7YaqjEX7TJXKeCQPchjB6dJwN3AKwCwLS1H5V_3ZqNT1cKOn4-lrxUEFd5LA4_gQiRC7coDkG5DGnzHfcPhdKUiVT8plvz-pwQNwR71IQXk0IIQVxka7yzAstjfjbNnB3RVx2xfOc8nN8L8iBNkLCCSK0MURdGF9BBtmLt0E8G7jP1UjY3xOMZb7TZg', 'UV50+', 'Conjunto infantil com proteção UV50+ e babados delicados.', 1],
            ['ac-01', 'Bolsa de Palha Artesanal', 'acessorios', 'bolsas', 520.00, 'Palha Natural', 'https://lh3.googleusercontent.com/aida/AP1WRLvLdFDjrN1Ch0I0sETtUo3lAAJy0Qi9wmyvtcvNvs8PwcKuUvg1Rw8AlDcWc1nhAujPPjHsbZiz7DOmkPkarF0XNrBK9Lg5ULwGeyo_rRgsm0ZrWoNReySdGKdiz-UtMdUzWvBXAp7Oz5_73v-sCIa2TkyNaI3yYCG8yUylTG1tjPBu4A7r_A2a_R_9hzVZojcrilI_mizn3eNpgZtgcT7l019ZRJuWipAAz3-a6--k-BKflAPQq-gbeg4', 'Artesanal', 'Bolsa estruturada em palha de carnaúba com alças de couro legítimo.', 1],
            ['ps-01', 'Camisa UV50+ Manga Longa', 'protecao-solar', 'camisas', 380.00, 'Branco Areia', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm-9YbUBjlXEG7NodgcFlxNNNv6Qy66o6LxaX5_LHKAeD39fPiSjEhw84fNC8d7etrqeRyJ7WBHBSOk256Ap6jaiT30elfCCSc8FGF7pPW5rHqHN4ls37-I-HHA0s61h5clQHdfRSxPyjxngdr3Bi0uZ1hQ48Op8-QYqrfFQVoV1IBQKjYPHXqnFjwrgHL3q-kSxPwHyyj9z_-7Q4LhtinuSoqki0xluit7m91xPzdrVDBqv6q_1k1U51JA_Uh1avOpOqEgfC5xPg', 'UV50+', 'Camisa em poliamida com tecnologia de proteção UV50+ permanente e toque gelado.', 1]
        ];

        $pIns = $pdo->prepare("
            INSERT INTO products (id, name, category_id, subcategory_id, price, color, image, badge, description, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image)
        ");

        foreach ($initialProducts as $p) {
            $pIns->execute($p);
        }

        $status['products_count'] = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
        $status['products_auto_synced'] = 'Catálogo inicial de produtos inserido no MySQL com sucesso!';
    }

} catch (PDOException $e) {
    $status['connection_status'] = 'ERROR';
    $status['error_code'] = $e->getCode();
    $status['error_details'] = $e->getMessage();
    $status['message'] = 'Falha ao conectar ao MySQL. Verifique se o banco e usuário foram criados no cPanel e se o usuário tem privilégios totais.';
}

echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
