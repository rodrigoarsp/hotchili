-- =========================================================
-- BANCO DE DADOS: rod38226_hotchili_db
-- Compatível com MySQL 5.7+ / MariaDB 10.3+ (HostGator cPanel)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `rod38226_hotchili_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rod38226_hotchili_db`;

-- ---------------------------------------------------------
-- 1. TABELA DE CATEGORIAS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `order_index` INT DEFAULT 0,
    `active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. TABELA DE SUBCATEGORIAS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `subcategories` (
    `id` VARCHAR(50) NOT NULL,
    `category_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `order_index` INT DEFAULT 0,
    `active` TINYINT(1) DEFAULT 1,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. TABELA DE PRODUTOS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category_id` VARCHAR(50) NOT NULL,
    `subcategory_id` VARCHAR(50) NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `promotional_price` DECIMAL(10, 2) NULL,
    `color` VARCHAR(100) NOT NULL,
    `image` TEXT NOT NULL,
    `gallery` JSON NULL,
    `badge` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `details` JSON NULL,
    `featured` TINYINT(1) DEFAULT 0,
    `active` TINYINT(1) DEFAULT 1,
    `stock_total` INT DEFAULT 0,
    `weight_kg` DECIMAL(6, 3) DEFAULT 0.300,
    `width_cm` DECIMAL(6, 2) DEFAULT 20.00,
    `height_cm` DECIMAL(6, 2) DEFAULT 10.00,
    `length_cm` DECIMAL(6, 2) DEFAULT 25.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_featured` (`featured`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 4. TABELA DE VARIAÇÕES DE ESTOQUE (POR TAMANHO)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_variants` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `size` VARCHAR(10) NOT NULL, -- P, M, G, GG, etc.
    `sku` VARCHAR(100) NULL,
    `stock_quantity` INT DEFAULT 10,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_product_size` (`product_id`, `size`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 5. TABELA DE HEROS & PUBLICAÇÕES
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroes` (
    `page_id` VARCHAR(50) NOT NULL,
    `badge` VARCHAR(100) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_url` TEXT NULL,
    `image_alt` VARCHAR(255) NULL,
    `type` VARCHAR(50) DEFAULT 'category',
    `buttons` JSON NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 6. TABELA DE PEDIDOS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) NOT NULL,
    `customer_name` VARCHAR(255) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `customer_cpf` VARCHAR(20) NOT NULL,
    `customer_phone` VARCHAR(30) NOT NULL,
    `shipping_cep` VARCHAR(10) NOT NULL,
    `shipping_address` VARCHAR(255) NOT NULL,
    `shipping_number` VARCHAR(50) NOT NULL,
    `shipping_complement` VARCHAR(100) NULL,
    `shipping_neighborhood` VARCHAR(100) NOT NULL,
    `shipping_city` VARCHAR(100) NOT NULL,
    `shipping_state` VARCHAR(10) NOT NULL,
    `shipping_service` VARCHAR(50) DEFAULT 'SEDEX',
    `shipping_cost` DECIMAL(10, 2) DEFAULT 0.00,
    `shipping_tracking_code` VARCHAR(50) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `discount` DECIMAL(10, 2) DEFAULT 0.00,
    `total` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL, -- pix, credit_card, boleto
    `payment_status` VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, refunded
    `mercadopago_payment_id` VARCHAR(100) NULL,
    `mercadopago_qr_code` TEXT NULL,
    `mercadopago_qr_code_base64` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 7. TABELA DE ITENS DO PEDIDO
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `order_id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_image` TEXT NULL,
    `size` VARCHAR(10) NOT NULL,
    `color` VARCHAR(100) NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 8. TABELA DE CONFIGURAÇÕES DE API (Mercado Pago / Correios)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
    `key_name` VARCHAR(100) NOT NULL,
    `key_value` TEXT NOT NULL,
    `description` VARCHAR(255) NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 9. TABELA DE USUÁRIOS ADMINISTRADORES DO CMS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin',
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- SEED INICIAL: CATEGORIAS, CONFIGURAÇÕES & ADMIN
-- ---------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `order_index`) VALUES
('moda-banho', 'Moda Banho', 'moda-banho', 1),
('resort-sunset', 'Resort & Sunset', 'resort-sunset', 2),
('kids', 'Hot Chili Kids', 'kids', 3),
('acessorios', 'Acessórios & Joias', 'acessorios', 4),
('protecao-solar', 'Proteção Solar UPF50+', 'protecao-solar', 5)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `settings` (`key_name`, `key_value`, `description`) VALUES
('mercadopago_public_key', 'TEST-00000000-0000-0000-0000-000000000000', 'Chave Pública Mercado Pago'),
('mercadopago_access_token', 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000', 'Access Token Privado Mercado Pago'),
('correios_origin_cep', '01001000', 'CEP de Origem para cálculo de frete (São Paulo/SP)'),
('correios_handling_fee', '0.00', 'Taxa extra de manuseio ou embalagem'),
('free_shipping_threshold', '600.00', 'Valor mínimo para Frete Grátis'),
('admin_password', 'hotchili2026', 'Senha mestra do painel CMS')
ON DUPLICATE KEY UPDATE `key_name`=VALUES(`key_name`);

INSERT INTO `admin_users` (`username`, `email`, `password_hash`, `name`) VALUES
('admin', 'admin@hotchili.com.br', '$2y$10$w8gS9j3sKxH1b8uVfLg4pej5B0xN1vOqKk7P9w9rZzP9yL0XpM8tW', 'Administrador VIP')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);
