const { useState, useEffect } = React;

// Importar serviços compartilhados da raiz
import { ApiService } from '../../js/services/ApiService.js';

export function App() {
    // Estado de Autenticação
    const [currentUser, setCurrentUser] = useState(null);
    const [loginUsername, setLoginUsername] = useState('admin');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Estados do Painel
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [heroes, setHeroes] = useState({});
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [toast, setToast] = useState(null);

    // Estado para Troca de Senha
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [confirmAdminPassword, setConfirmAdminPassword] = useState('');

    // Modal de Produto (Novo / Editar)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Modal de Hero (Editar Banner)
    const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
    const [currentHeroKey, setCurrentHeroKey] = useState('home');
    const [currentHero, setCurrentHero] = useState(null);

    // Verificar sessão existente ao carregar
    useEffect(() => {
        const user = ApiService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            loadData();
        } else {
            setLoading(false);
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prods, hrs, ords, sttgs] = await Promise.all([
                ApiService.getProducts(),
                ApiService.getHeroes(),
                ApiService.getOrders(),
                ApiService.getSettings()
            ]);
            setProducts(prods);
            setHeroes(hrs);
            setOrders(ords);
            setSettings(sttgs);
        } catch (err) {
            console.error('Erro ao carregar dados do CMS:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ==========================================
    // AUTENTICAÇÃO (LOGIN / LOGOUT)
    // ==========================================

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);
        try {
            const res = await ApiService.login(loginUsername, loginPassword);
            if (res.success) {
                setCurrentUser(res.user);
                await loadData();
                showToast(`Bem-vindo ao painel, ${res.user.name}!`);
            }
        } catch (err) {
            setLoginError(err.message || 'Credenciais inválidas. Verifique o usuário e a senha.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        ApiService.logout();
        setCurrentUser(null);
        setLoginPassword('');
        showToast('Sessão encerrada com segurança.');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newAdminPassword !== confirmAdminPassword) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }
        try {
            await ApiService.changePassword(newAdminPassword);
            setNewAdminPassword('');
            setConfirmAdminPassword('');
            showToast('Senha de administrador alterada com sucesso!');
        } catch (err) {
            showToast(err.message || 'Erro ao alterar senha', 'error');
        }
    };

    // ==========================================
    // OPERAÇÕES DE PRODUTO (CRUD)
    // ==========================================

    const handleOpenProductModal = (product = null) => {
        if (product) {
            setCurrentProduct({ ...product });
        } else {
            setCurrentProduct({
                id: '',
                name: '',
                category: 'moda-banho',
                subcategory: '',
                price: '',
                color: 'Ouro Nobre',
                image: 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw',
                badge: 'Novo',
                description: '',
                featured: true,
                stock_P: 5,
                stock_M: 8,
                stock_G: 5,
                stock_GG: 2
            });
        }
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const priceNum = parseFloat(currentProduct.price) || 0;
            const updatedProduct = {
                ...currentProduct,
                price: priceNum,
                formattedPrice: `R$ ${priceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            };

            await ApiService.saveProduct(updatedProduct);
            await loadData();
            setIsProductModalOpen(false);
            showToast(currentProduct.id ? 'Produto atualizado com sucesso!' : 'Novo produto criado com sucesso!');
        } catch (err) {
            showToast('Erro ao salvar produto', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (confirm('Tem certeza de que deseja remover esta peça de luxo da vitrine?')) {
            await ApiService.deleteProduct(id);
            await loadData();
            showToast('Produto excluído com sucesso!');
        }
    };

    // ==========================================
    // OPERAÇÕES DE HERO & PUBLICAÇÕES
    // ==========================================

    const handleOpenHeroModal = (key) => {
        setCurrentHeroKey(key);
        setCurrentHero({ ...(heroes[key] || {}) });
        setIsHeroModalOpen(true);
    };

    const handleSaveHero = async (e) => {
        e.preventDefault();
        try {
            await ApiService.saveHero(currentHeroKey, currentHero);
            await loadData();
            setIsHeroModalOpen(false);
            showToast(`Hero de "${currentHeroKey}" atualizada com sucesso!`);
        } catch (err) {
            showToast('Erro ao atualizar Hero', 'error');
        }
    };

    // ==========================================
    // OPERAÇÕES DE CONFIGURAÇÃO
    // ==========================================

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await ApiService.saveSettings(settings);
            showToast('Configurações de API salvas com sucesso!');
        } catch (err) {
            showToast('Erro ao salvar configurações', 'error');
        }
    };

    // =========================================================
    // TELA DE LOGIN (QUANDO NÃO AUTENTICADO)
    // =========================================================
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl space-y-6">
                    {/* Header do Login */}
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold font-display text-lg mx-auto shadow-lg shadow-primary/20">
                            HC
                        </div>
                        <h2 className="font-display font-bold text-xl tracking-wider text-on-surface uppercase mt-3">HOT CHILI</h2>
                        <p className="text-xs uppercase tracking-widest text-primary font-semibold">Painel Administrativo VIP</p>
                        <p className="text-xs text-on-surface-muted pt-1">Digite suas credenciais de administrador para acessar o CMS.</p>
                    </div>

                    {/* Alerta de Erro */}
                    {loginError && (
                        <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            <span>{loginError}</span>
                        </div>
                    )}

                    {/* Formulário de Login */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Usuário ou E-mail</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">person</span>
                                <input
                                    required
                                    type="text"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-on-surface mb-1 uppercase tracking-wider">Senha de Acesso</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">lock</span>
                                <input
                                    required
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3 bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">login</span>
                            <span>{isLoggingIn ? 'Autenticando...' : 'Acessar Painel'}</span>
                        </button>
                    </form>

                    {/* Dica de Acesso Padrão */}
                    <div className="p-3 bg-surface rounded-lg border border-surface-border/60 text-center space-y-1">
                        <span className="text-[11px] text-on-surface-muted block">Acesso padrão inicial:</span>
                        <div className="text-xs text-primary font-mono font-semibold">
                            Usuário: <strong>admin</strong> &bull; Senha: <strong>hotchili2026</strong>
                        </div>
                    </div>

                    <div className="text-center pt-2">
                        <a href="../index.html" className="text-xs text-on-surface-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar para a Loja
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Filtros de produtos
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.color.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory || p.category_id === selectedCategory;
        return matchesSearch && matchesCat;
    });

    // Métricas para o Dashboard
    const totalRevenue = orders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
    const approvedOrders = orders.filter(o => o.payment_status === 'approved').length;

    return (
        <div className="flex min-h-screen bg-surface text-on-surface">
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-surface-card border-r border-surface-border flex flex-col justify-between hidden md:flex">
                <div>
                    {/* Logo */}
                    <div className="p-6 border-b border-surface-border">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold font-display text-sm">
                                HC
                            </span>
                            <div>
                                <h1 className="font-display font-bold text-sm tracking-widest text-on-surface uppercase">HOT CHILI</h1>
                                <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">Headless CMS</p>
                            </div>
                        </div>
                    </div>

                    {/* Menus de Navegação */}
                    <nav className="p-4 space-y-1">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                            { id: 'products', label: 'Produtos (CRUD)', icon: 'styler' },
                            { id: 'heroes', label: 'Publicações & Heros', icon: 'view_carousel' },
                            { id: 'orders', label: 'Pedidos & Vendas', icon: 'shopping_bag' },
                            { id: 'settings', label: 'APIs & Configurações', icon: 'tune' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10'
                                        : 'text-on-surface-muted hover:bg-surface-hover hover:text-on-surface'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Status do HostGator & Botão Sair */}
                <div className="p-4 border-t border-surface-border space-y-3">
                    <div className="p-3 bg-surface rounded-lg border border-surface-border space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-on-surface-muted">Ambiente:</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                HostGator cPanel
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-on-surface-muted">Banco:</span>
                            <span className="text-primary font-semibold truncate max-w-[120px]">rod38226_hotchili_db</span>
                        </div>
                        <a 
                            href="../index.html" 
                            target="_blank" 
                            className="block text-center mt-2 py-1.5 bg-surface-hover hover:bg-primary/20 text-primary text-xs font-semibold rounded border border-primary/30 transition-colors"
                        >
                            Ver Loja Ao Vivo &rarr;
                        </a>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Encerrar Sessão</span>
                    </button>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Superior */}
                <header className="h-16 bg-surface-card border-b border-surface-border flex items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="font-display text-lg font-bold text-on-surface capitalize">
                            {activeTab === 'dashboard' && 'Visão Geral & Métricas'}
                            {activeTab === 'products' && 'Gerenciamento de Produtos'}
                            {activeTab === 'heroes' && 'Publicações & Hero Sections'}
                            {activeTab === 'orders' && 'Gestão de Pedidos & Rastreamento'}
                            {activeTab === 'settings' && 'Integrações (Mercado Pago, Correios & Senha)'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-on-surface-muted">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Conectado: <strong className="text-on-surface">{currentUser.username}</strong>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:border-rose-500/50 text-xs text-on-surface-muted hover:text-rose-400 transition-colors"
                            title="Sair do Painel"
                        >
                            <span className="material-symbols-outlined text-base">logout</span>
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </header>

                {/* Notificação Toast */}
                {toast && (
                    <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold bg-emerald-950 border border-emerald-500/50 text-emerald-200 animate-bounce">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {toast.message}
                    </div>
                )}

                {/* Conteúdo da Aba Selecionada */}
                <main className="p-4 sm:p-8 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
                    {/* ========================================================= */}
                    {/* ABA: DASHBOARD */}
                    {/* ========================================================= */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Cards de Métricas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div className="p-5 bg-surface-card rounded-xl border border-surface-border">
                                    <span className="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Faturamento Total</span>
                                    <div className="mt-2 text-2xl font-bold font-display text-primary">
                                        R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                    <span className="text-[11px] text-emerald-400 mt-1 inline-block">Mercado Pago integrado</span>
                                </div>
                                <div className="p-5 bg-surface-card rounded-xl border border-surface-border">
                                    <span className="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Pedidos Aprovados</span>
                                    <div className="mt-2 text-2xl font-bold font-display text-on-surface">
                                        {approvedOrders} pedidos
                                    </div>
                                    <span className="text-[11px] text-on-surface-muted mt-1 inline-block">100% liquidados</span>
                                </div>
                                <div className="p-5 bg-surface-card rounded-xl border border-surface-border">
                                    <span className="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Peças Cadastradas</span>
                                    <div className="mt-2 text-2xl font-bold font-display text-on-surface">
                                        {products.length} itens
                                    </div>
                                    <span className="text-[11px] text-primary mt-1 inline-block">Em 5 categorias ativas</span>
                                </div>
                                <div className="p-5 bg-surface-card rounded-xl border border-surface-border">
                                    <span className="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Frete Médio (Correios)</span>
                                    <div className="mt-2 text-2xl font-bold font-display text-on-surface">
                                        R$ 24,90
                                    </div>
                                    <span className="text-[11px] text-on-surface-muted mt-1 inline-block">PAC / SEDEX Brasil</span>
                                </div>
                            </div>

                            {/* Tabela de Pedidos Recentes */}
                            <div className="bg-surface-card rounded-xl border border-surface-border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-display font-bold text-base text-on-surface">Vendas Recentes</h3>
                                    <button onClick={() => setActiveTab('orders')} className="text-xs text-primary hover:underline font-semibold">
                                        Ver todos os pedidos &rarr;
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-surface-border text-xs text-on-surface-muted uppercase">
                                                <th className="pb-3">Pedido</th>
                                                <th className="pb-3">Cliente</th>
                                                <th className="pb-3">Valor</th>
                                                <th className="pb-3">Pagamento</th>
                                                <th className="pb-3">Envio</th>
                                                <th className="pb-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-border">
                                            {orders.slice(0, 5).map(o => (
                                                <tr key={o.id} className="hover:bg-surface-hover/50">
                                                    <td className="py-3 font-semibold text-primary">{o.id}</td>
                                                    <td className="py-3 text-on-surface">{o.customer_name}</td>
                                                    <td className="py-3 font-bold">R$ {parseFloat(o.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                    <td className="py-3 uppercase text-xs text-on-surface-muted">{o.payment_method}</td>
                                                    <td className="py-3 text-xs">{o.shipping_service} ({o.shipping_tracking})</td>
                                                    <td className="py-3">
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            {o.payment_status === 'approved' ? 'Aprovado' : 'Pendente'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* ABA: PRODUTOS (CRUD) */}
                    {/* ========================================================= */}
                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            {/* Barra de Ações */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-surface-card p-4 rounded-xl border border-surface-border">
                                <div className="flex flex-1 gap-3">
                                    <div className="relative flex-1">
                                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-muted text-lg">search</span>
                                        <input
                                            type="text"
                                            placeholder="Buscar por nome da peça ou cor..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-surface-border text-sm focus:outline-none focus:border-primary text-on-surface"
                                        />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-surface border border-surface-border text-sm rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                                    >
                                        <option value="all">Todas Categorias</option>
                                        <option value="moda-banho">Moda Banho</option>
                                        <option value="resort-sunset">Resort &amp; Sunset</option>
                                        <option value="kids">Kids</option>
                                        <option value="acessorios">Acessórios</option>
                                        <option value="protecao-solar">Proteção Solar</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => handleOpenProductModal()}
                                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-on-primary font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    <span>Cadastrar Nova Peça</span>
                                </button>
                            </div>

                            {/* Tabela de Produtos */}
                            <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-surface-border bg-surface/50 text-xs text-on-surface-muted uppercase">
                                                <th className="py-3 px-4">Foto</th>
                                                <th className="py-3 px-4">Nome &amp; Cor</th>
                                                <th className="py-3 px-4">Categoria</th>
                                                <th className="py-3 px-4">Preço</th>
                                                <th className="py-3 px-4">Selo</th>
                                                <th className="py-3 px-4 text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-border">
                                            {filteredProducts.map(p => (
                                                <tr key={p.id} className="hover:bg-surface-hover/40 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded-md border border-surface-border shadow-xs" />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-bold text-on-surface">{p.name}</div>
                                                        <div className="text-xs text-on-surface-muted">{p.color}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-1 rounded bg-surface border border-surface-border text-xs text-on-surface font-medium capitalize">
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 font-bold text-primary">
                                                        {p.formattedPrice || `R$ ${parseFloat(p.price).toFixed(2)}`}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {p.badge ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">
                                                                {p.badge}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-on-surface-muted">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => handleOpenProductModal(p)}
                                                            className="p-1.5 hover:bg-surface rounded text-primary transition-colors"
                                                            title="Editar Produto"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(p.id)}
                                                            className="p-1.5 hover:bg-rose-950/40 rounded text-rose-400 transition-colors"
                                                            title="Excluir Produto"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* ABA: HEROES & PUBLICAÇÕES */}
                    {/* ========================================================= */}
                    {activeTab === 'heroes' && (
                        <div className="space-y-6">
                            <div className="bg-surface-card p-6 rounded-xl border border-surface-border">
                                <h3 className="font-display font-bold text-base text-on-surface mb-2">Editor de Hero Sections &amp; Banners</h3>
                                <p className="text-xs text-on-surface-muted mb-6">
                                    Gerencie todos os títulos, slogans, selos de coleção e imagens de fundo exibidos no topo de cada página da loja.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {Object.entries(heroes).map(([key, hero]) => (
                                        <div key={key} className="p-5 bg-surface rounded-xl border border-surface-border flex flex-col justify-between hover:border-primary/40 transition-colors">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                                        Página: {key}
                                                    </span>
                                                    <span className="text-xs text-on-surface-muted">{hero.badge}</span>
                                                </div>
                                                <h4 className="font-display font-bold text-lg text-on-surface">{hero.title}</h4>
                                                <p className="text-xs text-on-surface-muted line-clamp-2">{hero.description}</p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
                                                <span className="text-[11px] text-on-surface-muted truncate max-w-[200px]">
                                                    {hero.imageUrl ? 'Com imagem de fundo' : 'Layout minimalista'}
                                                </span>
                                                <button
                                                    onClick={() => handleOpenHeroModal(key)}
                                                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit_note</span>
                                                    Editar Textos &amp; Imagem
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* ABA: PEDIDOS */}
                    {/* ========================================================= */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <div className="bg-surface-card p-6 rounded-xl border border-surface-border">
                                <h3 className="font-display font-bold text-base text-on-surface mb-4">Gestão de Pedidos e Rastreio</h3>
                                <div className="space-y-4">
                                    {orders.map(o => (
                                        <div key={o.id} className="p-4 bg-surface rounded-xl border border-surface-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-display font-bold text-primary text-base">{o.id}</span>
                                                    <span className="text-xs text-on-surface-muted">• {new Date(o.created_at).toLocaleDateString('pt-BR')}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                                        {o.payment_status === 'approved' ? 'Pago' : 'Pendente'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-on-surface mt-1">{o.customer_name} ({o.customer_phone})</p>
                                                <p className="text-xs text-on-surface-muted">Envio via {o.shipping_service} • Rastreio: <strong className="text-on-surface">{o.shipping_tracking}</strong></p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-display font-bold text-lg text-primary">R$ {parseFloat(o.total).toFixed(2)}</span>
                                                <div className="text-xs text-on-surface-muted uppercase">{o.payment_method} (Mercado Pago)</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* ABA: CONFIGURAÇÕES, APIS & SENHA */}
                    {/* ========================================================= */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 max-w-3xl">
                            {/* Alterar Senha do Administrador */}
                            <form onSubmit={handleChangePassword} className="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
                                    <div>
                                        <h3 className="font-display font-bold text-base text-on-surface">Alterar Senha do Administrador</h3>
                                        <p className="text-xs text-on-surface-muted">Defina uma nova senha segura para o acesso ao painel CMS.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-on-surface mb-1">Nova Senha (mín. 6 caracteres)</label>
                                        <input
                                            required
                                            type="password"
                                            value={newAdminPassword}
                                            onChange={(e) => setNewAdminPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-on-surface mb-1">Confirmar Nova Senha</label>
                                        <input
                                            required
                                            type="password"
                                            value={confirmAdminPassword}
                                            onChange={(e) => setConfirmAdminPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-surface hover:bg-surface-hover border border-primary/40 text-primary font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
                                >
                                    Atualizar Senha
                                </button>
                            </form>

                            {/* Configurações Mercado Pago e Correios */}
                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                {/* Mercado Pago */}
                                <div className="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                                        <div>
                                            <h3 className="font-display font-bold text-base text-on-surface">API do Mercado Pago</h3>
                                            <p className="text-xs text-on-surface-muted">Credenciais para processamento de PIX instantâneo e Cartão de Crédito.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-on-surface mb-1">Public Key (Chave Pública)</label>
                                            <input
                                                type="text"
                                                value={settings.mercadopago_public_key || ''}
                                                onChange={(e) => setSettings({ ...settings, mercadopago_public_key: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-on-surface mb-1">Access Token (Chave Privada / Sandbox / Produção)</label>
                                            <input
                                                type="password"
                                                value={settings.mercadopago_access_token || ''}
                                                onChange={(e) => setSettings({ ...settings, mercadopago_access_token: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Correios & Frete */}
                                <div className="bg-surface-card p-6 rounded-xl border border-surface-border space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                                        <div>
                                            <h3 className="font-display font-bold text-base text-on-surface">API dos Correios &amp; Frete</h3>
                                            <p className="text-xs text-on-surface-muted">Configurações de CEP de origem para cálculo de frete SEDEX e PAC.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-on-surface mb-1">CEP de Origem (Centro de Distribuição)</label>
                                            <input
                                                type="text"
                                                value={settings.correios_origin_cep || ''}
                                                onChange={(e) => setSettings({ ...settings, correios_origin_cep: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-on-surface mb-1">Valor Mínimo para Frete Grátis (R$)</label>
                                            <input
                                                type="number"
                                                value={settings.free_shipping_threshold || 600}
                                                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2.5 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary-dark text-on-primary font-bold px-8 py-3 rounded-lg text-sm shadow-md shadow-primary/20 transition-all"
                                >
                                    Salvar Todas as Configurações de API
                                </button>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            {/* ========================================================= */}
            {/* MODAL: CADASTRO / EDIÇÃO DE PRODUTO */}
            {/* ========================================================= */}
            {isProductModalOpen && currentProduct && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
                        <div className="p-6 border-b border-surface-border flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg text-on-surface">
                                {currentProduct.id ? 'Editar Peça de Luxo' : 'Cadastrar Nova Peça'}
                            </h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-on-surface-muted hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-on-surface mb-1">Nome do Produto</label>
                                    <input
                                        required
                                        type="text"
                                        value={currentProduct.name}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                        placeholder="Ex: Biquíni Cortininha Golden Hour"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">Categoria Principal</label>
                                    <select
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                    >
                                        <option value="moda-banho">Moda Banho</option>
                                        <option value="resort-sunset">Resort &amp; Sunset</option>
                                        <option value="kids">Hot Chili Kids</option>
                                        <option value="acessorios">Acessórios &amp; Joias</option>
                                        <option value="protecao-solar">Proteção Solar UPF50+</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">Preço (R$)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                        placeholder="490.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">Cor / Acabamento</label>
                                    <input
                                        type="text"
                                        value={currentProduct.color}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, color: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                        placeholder="Ex: Dourado &amp; Ébano"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-on-surface mb-1">Selo / Badge</label>
                                    <input
                                        type="text"
                                        value={currentProduct.badge || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, badge: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                        placeholder="Ex: Lançamento, Exclusivo"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-on-surface mb-1">URL da Imagem Principal</label>
                                    <input
                                        required
                                        type="url"
                                        value={currentProduct.image}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
                                        className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none text-xs font-mono"
                                    />
                                </div>

                                {/* Controle de Estoque por Tamanho */}
                                <div className="sm:col-span-2 p-4 bg-surface rounded-lg border border-surface-border">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-3">Estoque por Tamanho</span>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['P', 'M', 'G', 'GG'].map(sz => (
                                            <div key={sz} className="text-center">
                                                <span className="text-xs text-on-surface-muted block mb-1">Tam {sz}</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={currentProduct[`stock_${sz}`] ?? 5}
                                                    onChange={(e) => setCurrentProduct({ ...currentProduct, [`stock_${sz}`]: parseInt(e.target.value) || 0 })}
                                                    className="w-full text-center px-2 py-1.5 bg-surface-card rounded border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-surface-border text-sm text-on-surface hover:bg-surface"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm shadow-md"
                                >
                                    Salvar Peça
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL: EDIÇÃO DE HERO / PUBLICAÇÃO */}
            {/* ========================================================= */}
            {isHeroModalOpen && currentHero && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-surface-border flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg text-on-surface">
                                Editar Hero: <span className="text-primary capitalize">{currentHeroKey}</span>
                            </h3>
                            <button onClick={() => setIsHeroModalOpen(false)} className="text-on-surface-muted hover:text-on-surface">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveHero} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">Selo / Badge</label>
                                <input
                                    type="text"
                                    value={currentHero.badge || ''}
                                    onChange={(e) => setCurrentHero({ ...currentHero, badge: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">Título Principal (H1)</label>
                                <input
                                    required
                                    type="text"
                                    value={currentHero.title || ''}
                                    onChange={(e) => setCurrentHero({ ...currentHero, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">Descrição Editorial</label>
                                <textarea
                                    rows="3"
                                    value={currentHero.description || ''}
                                    onChange={(e) => setCurrentHero({ ...currentHero, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface mb-1">URL da Imagem de Fundo</label>
                                <input
                                    type="url"
                                    value={currentHero.imageUrl || ''}
                                    onChange={(e) => setCurrentHero({ ...currentHero, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2 bg-surface rounded-lg border border-surface-border text-sm text-on-surface focus:border-primary focus:outline-none text-xs font-mono"
                                />
                            </div>

                            <div className="pt-4 border-t border-surface-border flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsHeroModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg border border-surface-border text-sm text-on-surface hover:bg-surface"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-on-primary font-bold text-sm shadow-md"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Montar React no root
const rootEl = document.getElementById('root');
if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<App />);
}
