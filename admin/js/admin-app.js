/**
 * admin-app.js
 * Aplicação Nativa do Painel CMS Headless Hot Chili.
 * Inclui Gestão de Mídia com Upload, Colagem de URL, Pré-visualização e Redimensionamento Inteligente.
 */
import { ApiService } from '../../js/services/ApiService.js';

class AdminApp {
    constructor() {
        this.currentUser = ApiService.getCurrentUser();
        this.activeTab = 'dashboard';
        this.products = [];
        this.heroes = {};
        this.orders = [];
        this.settings = {};
        this.searchTerm = '';
        this.selectedCategory = 'all';

        // Estado de Mídia no Modal de Produto
        this.productMediaTab = 'upload'; // 'upload' | 'url'
        this.productImagePreview = '';
        this.productRawFile = null;

        // Estado de Mídia no Modal de Hero
        this.heroMediaTab = 'upload'; // 'upload' | 'url'
        this.heroImagePreview = '';
        this.heroRawFile = null;

        this.init();
    }

    async init() {
        if (this.currentUser) {
            await this.loadData();
        }
        this.render();
    }

    async loadData() {
        try {
            const [prods, hrs, ords, sttgs] = await Promise.all([
                ApiService.getProducts(),
                ApiService.getHeroes(),
                ApiService.getOrders(),
                ApiService.getSettings()
            ]);
            this.products = prods || [];
            this.heroes = hrs || {};
            this.orders = ords || [];
            this.settings = sttgs || {};
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
    }

    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold ${
            isError ? 'bg-rose-950 border border-rose-500/50 text-rose-200' : 'bg-emerald-950 border border-emerald-500/50 text-emerald-200'
        } transition-all duration-300 transform translate-y-0`;
        toast.innerHTML = `
            <span class="material-symbols-outlined text-sm">${isError ? 'error' : 'check_circle'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    render() {
        const root = document.getElementById('root');
        if (!root) return;

        if (!this.currentUser) {
            root.innerHTML = this.renderLogin();
            this.bindLoginEvents();
            return;
        }

        root.innerHTML = `
            <div class="flex min-h-screen bg-surface text-on-surface">
                ${this.renderSidebar()}
                <div class="flex-1 flex flex-col min-w-0">
                    ${this.renderHeader()}
                    <main class="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
                        ${this.renderActiveTabContent()}
                    </main>
                </div>
            </div>
            ${this.renderProductModal()}
            ${this.renderHeroModal()}
        `;

        this.bindEvents();
    }

    // ==========================================
    // TELA DE LOGIN
    // ==========================================
    renderLogin() {
        return `
            <div class="min-h-screen bg-surface flex items-center justify-center p-4">
                <div class="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl space-y-6">
                    <div class="text-center space-y-2">
                        <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold font-display text-lg mx-auto shadow-lg shadow-primary/20">
                            HC
                        </div>
                        <h2 class="font-display font-bold text-xl tracking-wider text-on-surface uppercase mt-3">HOT CHILI</h2>
                        <p class="text-xs uppercase tracking-widest text-primary font-semibold">Painel Administrativo VIP</p>
                        <p class="text-xs text-on-surface-muted pt-1">Digite suas credenciais de administrador para acessar o CMS.</p>
                    </div>

                    <div id="login-error-box" class="hidden p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <span class="material-symbols-outlined text-base">error</span>
                        <span id="login-error-text"></span>
                    </div>

                    <form id="admin-login-form" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Usuário ou E-mail</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">person</span>
                                <input required id="login-username" type="text" value="admin" placeholder="admin" class="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary"/>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Senha de Acesso</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">lock</span>
                                <input required id="login-password" type="password" placeholder="••••••••" class="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono"/>
                            </div>
                        </div>

                        <button type="submit" id="login-submit-btn" class="w-full py-3 bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-lg">login</span>
                            <span>Acessar Painel</span>
                        </button>
                    </form>

                    <div class="p-3 bg-surface rounded-lg border border-surface-border/60 text-center space-y-1">
                        <span class="text-[11px] text-on-surface-muted block">Acesso padrão inicial:</span>
                        <div class="text-xs text-primary font-mono font-semibold">
                            Usuário: <strong>admin</strong> &bull; Senha: <strong>hotchili2026</strong>
                        </div>
                    </div>

                    <div class="text-center pt-2">
                        <a href="../index.html" class="text-xs text-on-surface-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                            <span class="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar para a Loja
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    bindLoginEvents() {
        const form = document.getElementById('admin-login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username')?.value || '';
            const p = document.getElementById('login-password')?.value || '';
            const btn = document.getElementById('login-submit-btn');
            const errBox = document.getElementById('login-error-box');
            const errText = document.getElementById('login-error-text');

            btn.disabled = true;
            btn.innerHTML = `<span>Autenticando...</span>`;

            try {
                const res = await ApiService.login(u, p);
                if (res.success) {
                    this.currentUser = res.user;
                    await this.loadData();
                    this.render();
                    this.showToast(`Bem-vindo, ${res.user.name}!`);
                }
            } catch (err) {
                if (errBox && errText) {
                    errText.textContent = err.message || 'Usuário ou senha incorretos.';
                    errBox.classList.remove('hidden');
                }
            } finally {
                btn.disabled = false;
                btn.innerHTML = `<span class="material-symbols-outlined text-lg">login</span><span>Acessar Painel</span>`;
            }
        });
    }

    // ==========================================
    // SIDEBAR & HEADER
    // ==========================================
    renderSidebar() {
        const tabs = [
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            { id: 'products', label: 'Produtos (CRUD)', icon: 'styler' },
            { id: 'heroes', label: 'Publicações & Heros', icon: 'view_carousel' },
            { id: 'orders', label: 'Pedidos & Vendas', icon: 'shopping_bag' },
            { id: 'settings', label: 'APIs & Configurações', icon: 'tune' },
        ];

        return `
            <aside class="w-64 bg-surface-card border-r border-surface-border flex flex-col justify-between hidden md:flex">
                <div>
                    <div class="p-6 border-b border-surface-border">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold font-display text-sm">
                                HC
                            </span>
                            <div>
                                <h1 class="font-display font-bold text-sm tracking-widest text-on-surface uppercase">HOT CHILI</h1>
                                <p class="text-[10px] uppercase tracking-widest text-primary font-semibold">Headless CMS</p>
                            </div>
                        </div>
                    </div>

                    <nav class="p-4 space-y-1">
                        ${tabs.map(tab => `
                            <button
                                data-tab-btn="${tab.id}"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    this.activeTab === tab.id
                                        ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10'
                                        : 'text-on-surface-muted hover:bg-surface-hover hover:text-on-surface'
                                }"
                            >
                                <span class="material-symbols-outlined text-lg">${tab.icon}</span>
                                <span>${tab.label}</span>
                            </button>
                        `).join('')}
                    </nav>
                </div>

                <div class="p-4 border-t border-surface-border space-y-3">
                    <div class="p-3 bg-surface rounded-lg border border-surface-border space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] text-on-surface-muted">Ambiente:</span>
                            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                HostGator cPanel
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-[11px]">
                            <span class="text-on-surface-muted">Banco:</span>
                            <span class="text-primary font-semibold truncate max-w-[120px]">rod38226_hotchili_db</span>
                        </div>
                        <a href="../index.html" target="_blank" class="block text-center mt-2 py-1.5 bg-surface-hover hover:bg-primary/20 text-primary text-xs font-semibold rounded border border-primary/30 transition-colors">
                            Ver Loja Ao Vivo &rarr;
                        </a>
                    </div>

                    <button id="sidebar-logout-btn" class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors">
                        <span class="material-symbols-outlined text-base">logout</span>
                        <span>Encerrar Sessão</span>
                    </button>
                </div>
            </aside>
        `;
    }

    renderHeader() {
        const titles = {
            dashboard: 'Visão Geral & Métricas',
            products: 'Gerenciamento de Produtos',
            heroes: 'Publicações & Hero Sections',
            orders: 'Gestão de Pedidos & Rastreamento',
            settings: 'Integrações (Mercado Pago, Correios & Senha)'
        };

        return `
            <header class="h-16 bg-surface-card border-b border-surface-border flex items-center justify-between px-4 sm:px-8">
                <span class="font-display text-lg font-bold text-on-surface capitalize">
                    ${titles[this.activeTab] || 'Painel Administrativo'}
                </span>

                <div class="flex items-center gap-4">
                    <span class="hidden sm:inline-flex items-center gap-1.5 text-xs text-on-surface-muted">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Conectado: <strong class="text-on-surface">${this.currentUser.username}</strong>
                    </span>
                    <button id="header-logout-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:border-rose-500/50 text-xs text-on-surface-muted hover:text-rose-400 transition-colors">
                        <span class="material-symbols-outlined text-base">logout</span>
                        <span class="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </header>
        `;
    }

    // ==========================================
    // CONTEÚDO DAS ABAS
    // ==========================================
    renderActiveTabContent() {
        switch (this.activeTab) {
            case 'dashboard':
                return this.renderDashboard();
            case 'products':
                return this.renderProductsTab();
            case 'heroes':
                return this.renderHeroesTab();
            case 'orders':
                return this.renderOrdersTab();
            case 'settings':
                return this.renderSettingsTab();
            default:
                return this.renderDashboard();
        }
    }

    renderDashboard() {
        const totalRevenue = this.orders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
        const approvedOrders = this.orders.filter(o => o.payment_status === 'approved').length;

        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div class="p-5 bg-surface-card rounded-xl border border-surface-border">
                        <span class="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Faturamento Total</span>
                        <div class="mt-2 text-2xl font-bold font-display text-primary">
                            R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <span class="text-[11px] text-emerald-400 mt-1 inline-block">Mercado Pago integrado</span>
                    </div>
                    <div class="p-5 bg-surface-card rounded-xl border border-surface-border">
                        <span class="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Pedidos Aprovados</span>
                        <div class="mt-2 text-2xl font-bold font-display text-on-surface">
                            ${approvedOrders} pedidos
                        </div>
                        <span class="text-[11px] text-on-surface-muted mt-1 inline-block">100% liquidados</span>
                    </div>
                    <div class="p-5 bg-surface-card rounded-xl border border-surface-border">
                        <span class="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Peças Cadastradas</span>
                        <div class="mt-2 text-2xl font-bold font-display text-on-surface">
                            ${this.products.length} itens
                        </div>
                        <span class="text-[11px] text-primary mt-1 inline-block">Catálogo Ativo</span>
                    </div>
                    <div class="p-5 bg-surface-card rounded-xl border border-surface-border">
                        <span class="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Frete Médio (Correios)</span>
                        <div class="mt-2 text-2xl font-bold font-display text-on-surface">
                            R$ 24,90
                        </div>
                        <span class="text-[11px] text-on-surface-muted mt-1 inline-block">PAC / SEDEX Brasil</span>
                    </div>
                </div>

                <div class="bg-surface-card rounded-xl border border-surface-border p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-display font-bold text-base text-on-surface">Vendas Recentes</h3>
                        <button data-tab-btn="orders" class="text-xs text-primary hover:underline font-semibold">
                            Ver todos os pedidos &rarr;
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-surface-border text-xs text-on-surface-muted uppercase">
                                    <th class="pb-3">Pedido</th>
                                    <th class="pb-3">Cliente</th>
                                    <th class="pb-3">Valor</th>
                                    <th class="pb-3">Pagamento</th>
                                    <th class="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-border">
                                ${this.orders.slice(0, 5).map(o => `
                                    <tr class="hover:bg-surface-hover/50">
                                        <td class="py-3 font-semibold text-primary">${o.id}</td>
                                        <td class="py-3 text-on-surface">${o.customer_name}</td>
                                        <td class="py-3 font-bold">R$ ${parseFloat(o.total || 0).toFixed(2)}</td>
                                        <td class="py-3 uppercase text-xs text-on-surface-muted">${o.payment_method}</td>
                                        <td class="py-3">
                                            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                ${o.payment_status === 'approved' ? 'Aprovado' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductsTab() {
        const filtered = this.products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                                  (p.color && p.color.toLowerCase().includes(this.searchTerm.toLowerCase()));
            const matchesCat = this.selectedCategory === 'all' || p.category === this.selectedCategory || p.category_id === this.selectedCategory;
            return matchesSearch && matchesCat;
        });

        return `
            <div class="space-y-6">
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-surface-card p-4 rounded-xl border border-surface-border">
                    <div class="flex flex-1 gap-3">
                        <div class="relative flex-1">
                            <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">search</span>
                            <input
                                id="product-search-input"
                                type="text"
                                placeholder="Buscar por nome da peça ou cor..."
                                value="${this.searchTerm}"
                                class="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-surface-border text-sm focus:outline-none focus:border-primary text-on-surface"
                            />
                        </div>
                        <select
                            id="product-category-filter"
                            class="bg-surface border border-surface-border text-sm rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                        >
                            <option value="all" ${this.selectedCategory === 'all' ? 'selected' : ''}>Todas Categorias</option>
                            <option value="moda-banho" ${this.selectedCategory === 'moda-banho' ? 'selected' : ''}>Moda Banho</option>
                            <option value="resort-sunset" ${this.selectedCategory === 'resort-sunset' ? 'selected' : ''}>Resort & Sunset</option>
                            <option value="kids" ${this.selectedCategory === 'kids' ? 'selected' : ''}>Kids</option>
                            <option value="acessorios" ${this.selectedCategory === 'acessorios' ? 'selected' : ''}>Acessórios</option>
                            <option value="protecao-solar" ${this.selectedCategory === 'protecao-solar' ? 'selected' : ''}>Proteção Solar</option>
                        </select>
                    </div>

                    <button
                        id="open-new-product-modal-btn"
                        class="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-on-primary font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-primary/20"
                    >
                        <span class="material-symbols-outlined text-lg">add</span>
                        <span>Cadastrar Nova Peça</span>
                    </button>
                </div>

                <div class="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="border-b border-surface-border bg-surface/50 text-xs text-on-surface-muted uppercase">
                                    <th class="py-3 px-4">Foto</th>
                                    <th class="py-3 px-4">Nome &amp; Cor</th>
                                    <th class="py-3 px-4">Categoria</th>
                                    <th class="py-3 px-4">Preço</th>
                                    <th class="py-3 px-4">Selo</th>
                                    <th class="py-3 px-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-surface-border">
                                ${filtered.map(p => `
                                    <tr class="hover:bg-surface-hover/40 transition-colors">
                                        <td class="py-3 px-4">
                                            <img src="${p.image}" alt="${p.name}" class="w-12 h-14 object-cover rounded-md border border-surface-border shadow-xs" />
                                        </td>
                                        <td class="py-3 px-4">
                                            <div class="font-bold text-on-surface">${p.name}</div>
                                            <div class="text-xs text-on-surface-muted">${p.color || ''}</div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <span class="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-on-surface font-medium capitalize">
                                                ${p.category || p.category_id || ''}
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 font-bold text-primary">
                                            ${p.formattedPrice || `R$ ${parseFloat(p.price || 0).toFixed(2)}`}
                                        </td>
                                        <td class="py-3 px-4">
                                            ${p.badge ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">${p.badge}</span>` : '<span class="text-xs text-on-surface-muted">—</span>'}
                                        </td>
                                        <td class="py-3 px-4 text-right space-x-2">
                                            <button data-edit-product-id="${p.id}" class="p-1.5 hover:bg-surface rounded text-primary transition-colors" title="Editar">
                                                <span class="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button data-delete-product-id="${p.id}" class="p-1.5 hover:bg-rose-950/40 rounded text-rose-400 transition-colors" title="Excluir">
                                                <span class="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderHeroesTab() {
        return `
            <div class="space-y-6">
                <div class="bg-surface-card p-6 rounded-xl border border-surface-border">
                    <h3 class="font-display font-bold text-base text-on-surface mb-2">Editor de Hero Sections &amp; Banners</h3>
                    <p class="text-xs text-on-surface-muted mb-6">
                        Gerencie todos os títulos, slogans, selos de coleção e imagens de fundo exibidos no topo de cada página da loja.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        ${Object.entries(this.heroes).map(([key, hero]) => `
                            <div class="p-5 bg-surface rounded-xl border border-surface-border flex flex-col justify-between hover:border-primary/40 transition-colors">
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                            Página: ${key}
                                        </span>
                                        <span class="text-xs text-on-surface-muted">${hero.badge || ''}</span>
                                    </div>
                                    <h4 class="font-display font-bold text-lg text-on-surface">${hero.title || ''}</h4>
                                    <p class="text-xs text-on-surface-muted line-clamp-2">${hero.description || ''}</p>
                                </div>

                                <div class="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
                                    <span class="text-[11px] text-on-surface-muted truncate max-w-[200px]">
                                        ${hero.image_url || hero.imageUrl ? 'Com imagem de fundo' : 'Layout minimalista'}
                                    </span>
                                    <button data-edit-hero-key="${key}" class="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                        <span class="material-symbols-outlined text-sm">edit_note</span>
                                        Editar Textos &amp; Imagem
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderOrdersTab() {
        return `
            <div class="space-y-6">
                <div class="bg-surface-card p-6 rounded-xl border border-surface-border">
                    <h3 class="font-display font-bold text-base text-on-surface mb-4">Gestão de Pedidos e Rastreio</h3>
                    <div class="space-y-4">
                        ${this.orders.map(o => `
                            <div class="p-4 bg-surface rounded-xl border border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-display font-bold text-primary text-base">${o.id}</span>
                                        <span class="text-xs text-on-surface-muted">• ${new Date(o.created_at).toLocaleDateString('pt-BR')}</span>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                            ${o.payment_status === 'approved' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </div>
                                    <p class="text-sm font-semibold text-on-surface mt-1">${o.customer_name} (${o.customer_phone || ''})</p>
                                    <p class="text-xs text-on-surface-muted">Envio via ${o.shipping_service || 'SEDEX'} • Rastreio: <strong class="text-on-surface">${o.shipping_tracking || '—'}</strong></p>
                                </div>
                                <div class="text-right">
                                    <span class="font-display font-bold text-lg text-primary">R$ ${parseFloat(o.total || 0).toFixed(2)}</span>
                                    <div class="text-xs text-on-surface-muted uppercase">${o.payment_method || 'PIX'} (Mercado Pago)</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderSettingsTab() {
        return `
            <div class="space-y-8 max-w-3xl">
                <form id="change-password-form" class="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary text-2xl">lock_reset</span>
                        <div>
                            <h3 class="font-display font-bold text-base text-on-surface">Alterar Senha do Administrador</h3>
                            <p class="text-xs text-on-surface-muted">Defina uma nova senha segura para o acesso ao painel CMS.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1">Nova Senha</label>
                            <input required id="new-admin-pass" type="password" placeholder="••••••••" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1">Confirmar Senha</label>
                            <input required id="confirm-admin-pass" type="password" placeholder="••••••••" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                        </div>
                    </div>

                    <button type="submit" class="bg-surface hover:bg-surface-hover border border-primary/40 text-primary font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors">
                        Atualizar Senha
                    </button>
                </form>

                <form id="api-settings-form" class="space-y-6">
                    <div class="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-2xl">credit_card</span>
                            <div>
                                <h3 class="font-display font-bold text-base text-on-surface">API do Mercado Pago</h3>
                                <p class="text-xs text-on-surface-muted">Credenciais para processamento de PIX instantâneo e Cartão de Crédito.</p>
                            </div>
                        </div>

                        <div class="space-y-3 pt-2">
                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Public Key</label>
                                <input id="settings-mp-public" type="text" value="${this.settings.mercadopago_public_key || ''}" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Access Token</label>
                                <input id="settings-mp-token" type="password" value="${this.settings.mercadopago_access_token || ''}" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                            </div>
                        </div>
                    </div>

                    <div class="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                            <div>
                                <h3 class="font-display font-bold text-base text-on-surface">API dos Correios &amp; Frete</h3>
                                <p class="text-xs text-on-surface-muted">Configurações de CEP de origem para cálculo de frete SEDEX e PAC.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">CEP de Origem</label>
                                <input id="settings-cep-origin" type="text" value="${this.settings.correios_origin_cep || '01001000'}" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Mínimo para Frete Grátis (R$)</label>
                                <input id="settings-free-shipping" type="number" value="${this.settings.free_shipping_threshold || 600}" class="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"/>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="bg-primary hover:bg-primary-dark text-on-primary font-bold px-8 py-3 rounded-lg text-sm shadow-md shadow-primary/20 transition-all">
                        Salvar Todas as Configurações de API
                    </button>
                </form>
            </div>
        `;
    }

    // ==========================================
    // MODAL DE PRODUTO COM UPLOAD & REDIMENSIONAMENTO
    // ==========================================
    renderProductModal() {
        return `
            <div id="product-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto hidden">
                <div class="bg-surface-card border border-surface-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
                    <div class="p-6 border-b border-surface-border flex items-center justify-between">
                        <h3 id="product-modal-title" class="font-display font-bold text-lg text-on-surface">Cadastrar Nova Peça</h3>
                        <button id="close-product-modal-btn" class="text-on-surface-muted hover:text-on-surface">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form id="save-product-form" class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                        <input type="hidden" id="modal-product-id" value=""/>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="sm:col-span-2">
                                <label class="block text-xs font-semibold text-on-surface mb-1">Nome do Produto</label>
                                <input required id="modal-product-name" type="text" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none" placeholder="Ex: Biquíni Cortininha Golden Hour"/>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Categoria Principal</label>
                                <select id="modal-product-category" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none">
                                    <option value="moda-banho">Moda Banho</option>
                                    <option value="resort-sunset">Resort &amp; Sunset</option>
                                    <option value="kids">Hot Chili Kids</option>
                                    <option value="acessorios">Acessórios &amp; Joias</option>
                                    <option value="protecao-solar">Proteção Solar UPF50+</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Preço (R$)</label>
                                <input required id="modal-product-price" type="number" step="0.01" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none" placeholder="490.00"/>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Cor / Acabamento</label>
                                <input id="modal-product-color" type="text" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none" placeholder="Ex: Dourado &amp; Ébano"/>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-on-surface mb-1">Selo / Badge</label>
                                <input id="modal-product-badge" type="text" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none" placeholder="Ex: Lançamento, Exclusivo"/>
                            </div>

                            <!-- SEÇÃO DE MÍDIA: UPLOAD E URL -->
                            <div class="sm:col-span-2 p-4 bg-surface rounded-xl border border-surface-border space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                        <span class="material-symbols-outlined text-base">photo_library</span>
                                        Foto da Peça (Mídia)
                                    </span>

                                    <!-- Alternador Upload / URL -->
                                    <div class="flex bg-surface-card p-0.5 rounded-lg border border-surface-border">
                                        <button type="button" id="prod-media-tab-upload-btn" class="px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary">
                                            Fazer Upload
                                        </button>
                                        <button type="button" id="prod-media-tab-url-btn" class="px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all">
                                            Colar URL
                                        </button>
                                    </div>
                                </div>

                                <!-- PAINEL UPLOAD -->
                                <div id="prod-upload-panel" class="space-y-3">
                                    <div id="prod-dropzone" class="border-2 border-dashed border-primary/30 hover:border-primary/70 bg-surface-card/60 hover:bg-surface-card transition-all rounded-xl p-5 text-center cursor-pointer relative group">
                                        <input type="file" id="prod-file-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                                        <div class="space-y-1">
                                            <span class="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">cloud_upload</span>
                                            <p class="text-xs font-bold text-on-surface">Clique para escolher a imagem ou arraste até aqui</p>
                                            <p class="text-[11px] text-on-surface-muted">Suporta JPG, PNG, WEBP e GIF</p>
                                        </div>
                                    </div>

                                    <!-- SELETOR DE REDIMENSIONAMENTO / PRESETS -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label class="block text-[11px] font-semibold text-on-surface-muted mb-1">Ajuste de Proporção &amp; Tamanho</label>
                                            <select id="prod-resize-preset" class="w-full px-3 py-1.5 bg-surface-card rounded-lg border border-surface-border text-xs text-on-surface focus:border-primary focus:outline-none">
                                                <option value="fashion_portrait">Retrato de Moda (800 x 1000 px — Padrão)</option>
                                                <option value="square">Quadrado (800 x 800 px)</option>
                                                <option value="original">Original Otimizado (Máx 1200 px)</option>
                                            </select>
                                        </div>
                                        <div class="flex items-end">
                                            <span class="text-[11px] text-on-surface-muted pb-1.5 block">
                                                ✨ Otimização automática de nitidez e compressão WebP leve.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- PAINEL URL -->
                                <div id="prod-url-panel" class="space-y-2 hidden">
                                    <label class="block text-[11px] font-semibold text-on-surface-muted">Cole o link público da imagem</label>
                                    <input id="modal-product-image" type="url" class="w-full px-4 py-2 bg-surface-card rounded-lg border border-surface-border text-xs text-on-surface focus:border-primary focus:outline-none font-mono" placeholder="https://exemplo.com/foto.jpg"/>
                                </div>

                                <!-- PREVIEW DA IMAGEM -->
                                <div id="prod-image-preview-container" class="pt-2 flex items-center gap-4 bg-surface-card p-3 rounded-xl border border-surface-border/60">
                                    <img id="prod-preview-img" src="https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw" class="w-16 h-20 object-cover rounded-lg border border-surface-border shadow-md" alt="Preview"/>
                                    <div class="flex-1 min-w-0">
                                        <span class="text-xs font-bold text-on-surface block truncate" id="prod-preview-name">Imagem Selecionada</span>
                                        <span class="text-[11px] text-emerald-400 block font-mono" id="prod-preview-status">Pronta para publicação</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-surface-border flex justify-end gap-3">
                            <button type="button" id="cancel-product-modal-btn" class="px-5 py-2.5 rounded-lg border border-surface-border text-sm text-on-surface hover:bg-surface">
                                Cancelar
                            </button>
                            <button type="submit" id="submit-product-modal-btn" class="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm shadow-md">
                                Salvar Peça
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // ==========================================
    // MODAL DE HERO COM UPLOAD & REDIMENSIONAMENTO
    // ==========================================
    renderHeroModal() {
        return `
            <div id="hero-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 hidden">
                <div class="bg-surface-card border border-surface-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                    <div class="p-6 border-b border-surface-border flex items-center justify-between">
                        <h3 id="hero-modal-title" class="font-display font-bold text-lg text-on-surface">Editar Hero</h3>
                        <button id="close-hero-modal-btn" class="text-on-surface-muted hover:text-on-surface">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form id="save-hero-form" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1">Selo / Badge</label>
                            <input id="modal-hero-badge" type="text" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"/>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1">Título Principal (H1)</label>
                            <input required id="modal-hero-title" type="text" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"/>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-on-surface mb-1">Descrição Editorial</label>
                            <textarea id="modal-hero-description" rows="3" class="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"></textarea>
                        </div>

                        <!-- GESTÃO DE MÍDIA HERO -->
                        <div class="p-4 bg-surface rounded-xl border border-surface-border space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-base">panorama</span>
                                    Imagem de Fundo (Banner)
                                </span>

                                <div class="flex bg-surface-card p-0.5 rounded-lg border border-surface-border">
                                    <button type="button" id="hero-media-tab-upload-btn" class="px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary">
                                        Upload
                                    </button>
                                    <button type="button" id="hero-media-tab-url-btn" class="px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all">
                                        URL
                                    </button>
                                </div>
                            </div>

                            <div id="hero-upload-panel" class="space-y-2">
                                <div id="hero-dropzone" class="border-2 border-dashed border-primary/30 hover:border-primary/70 bg-surface-card/60 hover:bg-surface-card transition-all rounded-xl p-4 text-center cursor-pointer relative group">
                                    <input type="file" id="hero-file-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                                    <div class="space-y-1">
                                        <span class="material-symbols-outlined text-2xl text-primary group-hover:scale-110 transition-transform">add_photo_alternate</span>
                                        <p class="text-xs font-bold text-on-surface">Enviar foto panorâmica do computador</p>
                                        <p class="text-[10px] text-on-surface-muted">Redimensionamento automático para Banner Ultra HD (1920x800)</p>
                                    </div>
                                </div>
                            </div>

                            <div id="hero-url-panel" class="space-y-2 hidden">
                                <input id="modal-hero-image" type="url" class="w-full px-4 py-2 bg-surface-card rounded-lg border border-surface-border text-xs text-on-surface focus:border-primary focus:outline-none font-mono" placeholder="https://exemplo.com/banner.jpg"/>
                            </div>

                            <div id="hero-image-preview-container" class="pt-2 flex items-center gap-4 bg-surface-card p-3 rounded-xl border border-surface-border/60">
                                <img id="hero-preview-img" src="" class="w-24 h-14 object-cover rounded-lg border border-surface-border shadow-md" alt="Preview"/>
                                <div class="flex-1 min-w-0">
                                    <span class="text-xs font-bold text-on-surface block truncate" id="hero-preview-name">Banner Atual</span>
                                    <span class="text-[11px] text-emerald-400 block font-mono">Pronto</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-surface-border flex justify-end gap-3">
                            <button type="button" id="cancel-hero-modal-btn" class="px-5 py-2.5 rounded-lg border border-surface-border text-sm text-on-surface hover:bg-surface">
                                Cancelar
                            </button>
                            <button type="submit" id="submit-hero-modal-btn" class="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm shadow-md">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // ==========================================
    // EVENTOS E INTERAÇÕES DO PAINEL
    // ==========================================
    bindEvents() {
        // Alternância de Abas
        document.querySelectorAll('[data-tab-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.getAttribute('data-tab-btn');
                if (tab) {
                    this.activeTab = tab;
                    this.render();
                }
            });
        });

        // Logout
        const logoutHandler = () => {
            ApiService.logout();
            this.currentUser = null;
            this.render();
            this.showToast('Sessão encerrada com segurança.');
        };
        document.getElementById('header-logout-btn')?.addEventListener('click', logoutHandler);
        document.getElementById('sidebar-logout-btn')?.addEventListener('click', logoutHandler);

        // Filtro e Busca de Produtos
        const searchInput = document.getElementById('product-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.render();
                const newInput = document.getElementById('product-search-input');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(this.searchTerm.length, this.searchTerm.length);
                }
            });
        }

        const catFilter = document.getElementById('product-category-filter');
        if (catFilter) {
            catFilter.addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.render();
            });
        }

        // Abrir Modal de Novo Produto
        document.getElementById('open-new-product-modal-btn')?.addEventListener('click', () => {
            this.openProductModal(null);
        });

        // Editar Produto
        document.querySelectorAll('[data-edit-product-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-product-id');
                const prod = this.products.find(p => p.id === id);
                if (prod) this.openProductModal(prod);
            });
        });

        // Excluir Produto
        document.querySelectorAll('[data-delete-product-id]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-delete-product-id');
                if (confirm('Tem certeza de que deseja remover esta peça da vitrine?')) {
                    await ApiService.deleteProduct(id);
                    await this.loadData();
                    this.render();
                    this.showToast('Produto excluído com sucesso!');
                }
            });
        });

        // ==========================================
        // EVENTOS DE MÍDIA / UPLOAD / REDIMENSIONAMENTO (PRODUTO)
        // ==========================================
        const prodTabUploadBtn = document.getElementById('prod-media-tab-upload-btn');
        const prodTabUrlBtn = document.getElementById('prod-media-tab-url-btn');
        const prodUploadPanel = document.getElementById('prod-upload-panel');
        const prodUrlPanel = document.getElementById('prod-url-panel');
        const prodFileInput = document.getElementById('prod-file-input');
        const prodUrlInput = document.getElementById('modal-product-image');
        const prodPreviewImg = document.getElementById('prod-preview-img');
        const prodPreviewName = document.getElementById('prod-preview-name');
        const prodPreviewStatus = document.getElementById('prod-preview-status');
        const prodResizePreset = document.getElementById('prod-resize-preset');

        if (prodTabUploadBtn && prodTabUrlBtn) {
            prodTabUploadBtn.addEventListener('click', () => {
                prodTabUploadBtn.className = 'px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary';
                prodTabUrlBtn.className = 'px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all';
                prodUploadPanel.classList.remove('hidden');
                prodUrlPanel.classList.add('hidden');
                this.productMediaTab = 'upload';
            });

            prodTabUrlBtn.addEventListener('click', () => {
                prodTabUrlBtn.className = 'px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary';
                prodTabUploadBtn.className = 'px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all';
                prodUrlPanel.classList.remove('hidden');
                prodUploadPanel.classList.add('hidden');
                this.productMediaTab = 'url';
            });
        }

        if (prodUrlInput) {
            prodUrlInput.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    prodPreviewImg.src = url;
                    prodPreviewName.textContent = 'Imagem via URL';
                    prodPreviewStatus.textContent = 'Link configurado';
                    this.productImagePreview = url;
                    this.productRawFile = null;
                }
            });
        }

        const handleProductFile = async (file) => {
            if (!file) return;
            prodPreviewStatus.textContent = 'Redimensionando e otimizando...';
            prodPreviewName.textContent = file.name;

            let targetW = 800, targetH = 1000;
            const preset = prodResizePreset?.value || 'fashion_portrait';
            if (preset === 'square') { targetW = 800; targetH = 800; }
            if (preset === 'original') { targetW = 1200; targetH = 1200; }

            try {
                const optimizedBase64 = await ApiService.resizeImage(file, targetW, targetH, 0.88);
                prodPreviewImg.src = optimizedBase64;
                prodUrlInput.value = optimizedBase64; // Salva o base64 temporário
                this.productImagePreview = optimizedBase64;
                this.productRawFile = optimizedBase64;
                prodPreviewStatus.textContent = `Otimizado para ${targetW}x${targetH} px`;
            } catch (err) {
                prodPreviewStatus.textContent = 'Erro ao processar imagem';
            }
        };

        if (prodFileInput) {
            prodFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleProductFile(e.target.files[0]);
                }
            });
        }

        if (prodResizePreset) {
            prodResizePreset.addEventListener('change', () => {
                if (prodFileInput?.files?.[0]) {
                    handleProductFile(prodFileInput.files[0]);
                }
            });
        }

        // Salvar Produto Form Submit
        document.getElementById('save-product-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-product-modal-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Salvando...</span>`;

            const id = document.getElementById('modal-product-id')?.value;
            const price = parseFloat(document.getElementById('modal-product-price')?.value) || 0;
            let finalImage = document.getElementById('modal-product-image')?.value || this.productImagePreview;

            // Se for base64 recortado, faz o upload para o servidor para gerar URL permanente na pasta /uploads/
            if (finalImage && finalImage.startsWith('data:image/')) {
                try {
                    const uploadRes = await ApiService.uploadImage(finalImage);
                    if (uploadRes && uploadRes.url) {
                        finalImage = uploadRes.url;
                    }
                } catch (err) {}
            }

            const prodData = {
                id: id || undefined,
                name: document.getElementById('modal-product-name')?.value,
                category: document.getElementById('modal-product-category')?.value,
                category_id: document.getElementById('modal-product-category')?.value,
                price: price,
                formattedPrice: `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                color: document.getElementById('modal-product-color')?.value,
                badge: document.getElementById('modal-product-badge')?.value,
                image: finalImage,
                featured: true
            };

            await ApiService.saveProduct(prodData);
            await this.loadData();
            this.closeProductModal();
            this.render();
            this.showToast(id ? 'Peça atualizada com sucesso!' : 'Nova peça cadastrada com sucesso!');
        });

        document.getElementById('close-product-modal-btn')?.addEventListener('click', () => this.closeProductModal());
        document.getElementById('cancel-product-modal-btn')?.addEventListener('click', () => this.closeProductModal());

        // ==========================================
        // EVENTOS DE MÍDIA / UPLOAD / REDIMENSIONAMENTO (HERO)
        // ==========================================
        const heroTabUploadBtn = document.getElementById('hero-media-tab-upload-btn');
        const heroTabUrlBtn = document.getElementById('hero-media-tab-url-btn');
        const heroUploadPanel = document.getElementById('hero-upload-panel');
        const heroUrlPanel = document.getElementById('hero-url-panel');
        const heroFileInput = document.getElementById('hero-file-input');
        const heroUrlInput = document.getElementById('modal-hero-image');
        const heroPreviewImg = document.getElementById('hero-preview-img');
        const heroPreviewName = document.getElementById('hero-preview-name');

        if (heroTabUploadBtn && heroTabUrlBtn) {
            heroTabUploadBtn.addEventListener('click', () => {
                heroTabUploadBtn.className = 'px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary';
                heroTabUrlBtn.className = 'px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all';
                heroUploadPanel.classList.remove('hidden');
                heroUrlPanel.classList.add('hidden');
            });

            heroTabUrlBtn.addEventListener('click', () => {
                heroTabUrlBtn.className = 'px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-on-primary';
                heroTabUploadBtn.className = 'px-3 py-1 rounded-md text-xs font-medium text-on-surface-muted hover:text-on-surface transition-all';
                heroUrlPanel.classList.remove('hidden');
                heroUploadPanel.classList.add('hidden');
            });
        }

        if (heroUrlInput) {
            heroUrlInput.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url) {
                    heroPreviewImg.src = url;
                    heroPreviewName.textContent = 'Banner via URL';
                    this.heroImagePreview = url;
                }
            });
        }

        if (heroFileInput) {
            heroFileInput.addEventListener('change', async (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    heroPreviewName.textContent = 'Processando Banner Ultra HD...';
                    try {
                        const optimizedBanner = await ApiService.resizeImage(file, 1920, 800, 0.85);
                        heroPreviewImg.src = optimizedBanner;
                        heroUrlInput.value = optimizedBanner;
                        this.heroImagePreview = optimizedBanner;
                        heroPreviewName.textContent = 'Banner 1920x800 px pronto';
                    } catch (err) {
                        heroPreviewName.textContent = 'Erro ao processar imagem';
                    }
                }
            });
        }

        // Editar Hero Modal
        document.querySelectorAll('[data-edit-hero-key]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-edit-hero-key');
                this.openHeroModal(key);
            });
        });

        document.getElementById('save-hero-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-hero-modal-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Salvando...</span>`;

            let finalHeroImage = document.getElementById('modal-hero-image')?.value || this.heroImagePreview;

            if (finalHeroImage && finalHeroImage.startsWith('data:image/')) {
                try {
                    const uploadRes = await ApiService.uploadImage(finalHeroImage);
                    if (uploadRes && uploadRes.url) {
                        finalHeroImage = uploadRes.url;
                    }
                } catch (err) {}
            }

            const heroData = {
                badge: document.getElementById('modal-hero-badge')?.value,
                title: document.getElementById('modal-hero-title')?.value,
                description: document.getElementById('modal-hero-description')?.value,
                imageUrl: finalHeroImage,
                image_url: finalHeroImage
            };

            await ApiService.saveHero(this.currentHeroKey, heroData);
            await this.loadData();
            this.closeHeroModal();
            this.render();
            this.showToast(`Hero de "${this.currentHeroKey}" atualizada com sucesso!`);
        });

        document.getElementById('close-hero-modal-btn')?.addEventListener('click', () => this.closeHeroModal());
        document.getElementById('cancel-hero-modal-btn')?.addEventListener('click', () => this.closeHeroModal());

        // Salvar Configurações de API
        document.getElementById('api-settings-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newSettings = {
                mercadopago_public_key: document.getElementById('settings-mp-public')?.value,
                mercadopago_access_token: document.getElementById('settings-mp-token')?.value,
                correios_origin_cep: document.getElementById('settings-cep-origin')?.value,
                free_shipping_threshold: parseFloat(document.getElementById('settings-free-shipping')?.value) || 600
            };
            await ApiService.saveSettings(newSettings);
            this.settings = { ...this.settings, ...newSettings };
            this.showToast('Configurações de API salvas com sucesso!');
        });

        // Alterar Senha
        document.getElementById('change-password-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const p1 = document.getElementById('new-admin-pass')?.value;
            const p2 = document.getElementById('confirm-admin-pass')?.value;
            if (p1 !== p2) {
                this.showToast('As senhas não coincidem!', true);
                return;
            }
            try {
                await ApiService.changePassword(p1);
                document.getElementById('new-admin-pass').value = '';
                document.getElementById('confirm-admin-pass').value = '';
                this.showToast('Senha de administrador alterada com sucesso!');
            } catch (err) {
                this.showToast(err.message || 'Erro ao alterar senha', true);
            }
        });
    }

    openProductModal(prod = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        if (!modal) return;

        document.getElementById('modal-product-id').value = prod ? prod.id : '';
        document.getElementById('modal-product-name').value = prod ? prod.name : '';
        document.getElementById('modal-product-category').value = prod ? (prod.category || prod.category_id || 'moda-banho') : 'moda-banho';
        document.getElementById('modal-product-price').value = prod ? prod.price : '';
        document.getElementById('modal-product-color').value = prod ? (prod.color || 'Ouro Nobre') : 'Ouro Nobre';
        document.getElementById('modal-product-badge').value = prod ? (prod.badge || '') : 'Novo';
        
        const initialImg = prod ? prod.image : 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';
        document.getElementById('modal-product-image').value = initialImg;
        document.getElementById('prod-preview-img').src = initialImg;
        document.getElementById('prod-preview-name').textContent = prod ? prod.name : 'Imagem Padrão';
        this.productImagePreview = initialImg;

        if (title) title.textContent = prod ? 'Editar Peça de Luxo' : 'Cadastrar Nova Peça';
        modal.classList.remove('hidden');
    }

    closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) modal.classList.add('hidden');
    }

    openHeroModal(key) {
        this.currentHeroKey = key;
        const hero = this.heroes[key] || {};
        const modal = document.getElementById('hero-modal');
        const title = document.getElementById('hero-modal-title');
        if (!modal) return;

        document.getElementById('modal-hero-badge').value = hero.badge || '';
        document.getElementById('modal-hero-title').value = hero.title || '';
        document.getElementById('modal-hero-description').value = hero.description || '';
        
        const heroImg = hero.image_url || hero.imageUrl || '';
        document.getElementById('modal-hero-image').value = heroImg;
        document.getElementById('hero-preview-img').src = heroImg || 'https://lh3.googleusercontent.com/aida-public/AB6AXuChO5ac7GM05feevK3AKK8ckQsGI8zyLHcWYSqe_79EJZdlx2wmGqC0y2R5n77qB43BCg8ZaumkWAFY-A4K0FwYdpstPtOZjV46hdS0LsCEGjlhKsFbZNKQ2ARh25p94SEXswwCKW0I-4HmyMCeafYQNTl4ip2xdVkoCVGNnv_P04FItAfYej34n9I4C63sDpmC_8_psqPCjX9kK4BnHkcrXq_i7I7Dx437I6J2xxT6FgW-6WFy652D';
        this.heroImagePreview = heroImg;

        if (title) title.textContent = `Editar Hero: ${key.toUpperCase()}`;
        modal.classList.remove('hidden');
    }

    closeHeroModal() {
        const modal = document.getElementById('hero-modal');
        if (modal) modal.classList.add('hidden');
    }
}

// Inicializar aplicativo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});
