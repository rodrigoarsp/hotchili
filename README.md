# 🌶️ Hot Chili — Luxury Beachwear & Headless CMS

> Plataforma completa de e-commerce para moda praia de alta costura com arquitetura modular, Painel CMS Headless em React, integração nativa com a API dos Correios (cálculo de frete em tempo real) e Mercado Pago (PIX com QR Code dinâmico e Cartão de Crédito), pronta para hospedagem no **cPanel / MySQL (HostGator)**.

---

## ✨ Funcionalidades Principais

### 🛍️ Loja Virtual (E-commerce)
- **Design de Alta Costura**: Estética *Dark & Gold Luxury*, micro-interações fluidas e tipografia moderna de alta legibilidade (`Outfit` e `Plus Jakarta Sans`).
- **100% Responsivo**: Layout otimizado para celulares, tablets e desktops com navegação por gestos e drawers fluídos.
- **Vitrines e Categorias Dinâmicas**:
  - Moda Banho (Biquínis, Maiôs, Sungas)
  - Resort & Sunset (Saídas de crochê, Calças de tricô, Vestidos)
  - Hot Chili Kids (Moda praia infantil com proteção UV)
  - Acessórios & Joias (Bolsas de palha, Cangas de seda, Joias banhadas a ouro 18k)
  - Proteção Solar UPF50+
- **Filtros em Tempo Real**: Barra de subcategorias fixa (*sticky subnav*) com filtragem instantânea sem recarregar a página.
- **Página de Detalhes do Produto**: Seleção de cores, tamanhos (P, M, G, GG), cálculo de CEP e curadoria "Complete o Look".
- **Sacola de Compras (CartDrawer)**: Gaveta lateral interativa com cálculo de subtotal, cupom e frete.
- **Checkout Transparente**:
  - Consulta automática de endereço via ViaCEP.
  - Cálculo de frete dos **Correios** (PAC e SEDEX com prazos e valores reais).
  - Pagamento **PIX** com geração de QR Code dinâmico e código Copia e Cola via **Mercado Pago**.
  - Pagamento via **Cartão de Crédito** com parcelamento em até 6x sem juros.

---

### 🎛️ Painel CMS Headless (`/admin`)
- **Tecnologia**: Desenvolvido em **React 18 + Tailwind CSS**.
- **Autenticação Segura**: Tela de login com usuário e senha para acesso exclusivo de administradores.
- **Dashboard & KPIs**: Faturamento total acumulado, pedidos aprovados, produtos em estoque e ticket médio.
- **CRUD Completo de Produtos**:
  - Cadastro e edição de peças com upload/URL de imagens.
  - Variações de cor e selos (*Bestseller*, *Exclusivo*, *Lançamento*, *UV50+*).
  - **Controle de estoque individual por tamanho (P, M, G, GG)**.
- **Editor de Publicações & Heros**: Edição em tempo real de títulos, slogans e imagens de fundo do topo de cada página.
- **Gestão de Pedidos**: Acompanhamento de vendas, status de pagamento do Mercado Pago e código de rastreio Correios.
- **Configurações de APIs**: Gerenciamento de credenciais do Mercado Pago (*Public Key* e *Access Token*), CEP de origem e alteração de senha.

---

## 🗄️ Estrutura do Projeto

```text
hotchili/
├── index.html               # Página Inicial
├── moda-banho.html          # Moda Banho
├── resort-sunset.html       # Resort & Sunset
├── kids.html                # Hot Chili Kids
├── acessorios.html          # Acessórios & Joias
├── protecao-solar.html      # Proteção Solar UPF50+
├── produto.html             # Detalhe do Produto
├── checkout.html            # Checkout Seguro
├── guia-tamanhos.html       # Guia de Medidas
├── atendimento.html         # Concierge VIP
├── .htaccess                # Configuração Apache / cPanel (HTTPS, Cache, Gzip)
│
├── admin/                   # Painel CMS Headless em React
│   ├── index.html           # Tela de Login e Dashboard
│   └── src/App.jsx          # Aplicação React do CMS
│
├── api/                     # Backend RESTful PHP para HostGator cPanel
│   ├── db.php               # Conexão MySQL (PDO)
│   ├── schema.sql           # Estrutura do banco de dados MySQL
│   ├── auth.php             # Login e autenticação
│   ├── products.php         # CRUD de produtos
│   ├── heroes.php           # Editor de banners
│   ├── correios.php         # Cálculo de frete Correios
│   └── mercadopago.php      # Integração Mercado Pago
│
├── css/                     # Estilos customizados
│   └── main.css
│
└── js/                      # JavaScript Modular
    ├── app.js               # Orquestrador
    ├── components/          # Header, Hero, ProductGrid, SubNavBar, Footer, etc.
    ├── services/            # ApiService, ProductService, HeroService, CartService
    └── pages/               # Controladores das páginas
```

---

## 🚀 Como Executar Localmente

1. Abra a pasta do projeto no VS Code ou terminal.
2. Inicie um servidor local (ex: extensão *Live Server* ou `npx serve .`).
3. Acesse a loja em: `http://localhost:3000` (ou porta do seu servidor).
4. Acesse o CMS em: `http://localhost:3000/admin`.
   - **Usuário**: `admin`
   - **Senha**: `hotchili2026`

---

## 🌐 Implantação na HostGator (cPanel / MySQL)

1. Crie o banco de dados `rod38226_hotchili_db` e o usuário no cPanel.
2. Importe o arquivo `api/schema.sql` no **phpMyAdmin**.
3. Configure a senha do banco no arquivo `api/db.php`.
4. Envie todos os arquivos para a pasta `public_html`.
5. Acesse `https://seudominio.com.br` e `https://seudominio.com.br/admin`.

---

## 📄 Licença

Projeto desenvolvido para **Hot Chili Luxury Beachwear**. Todos os direitos reservados.
