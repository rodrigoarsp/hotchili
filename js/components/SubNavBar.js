/**
 * SubNavBar.js
 * Componente unificado e reutilizável para o Painel 2 (Filtros, Subcategorias e Breadcrumbs).
 * Totalmente discreto, responsivo e com suporte a sticky scrolling fixo abaixo do Header.
 */
import { CategoryService } from '../services/CategoryService.js';
import { $ } from '../utils/dom.js';

export class SubNavBar {
    /**
     * Monta o SubNavBar diretamente em um elemento container (#subnav-root).
     * Garante que o elemento receba as classes sticky-subnav no elemento raiz do DOM.
     * @param {string|Element} target 
     * @param {Object} options 
     */
    static mount(target, options = {}) {
        const container = typeof target === 'string' ? $(target) : target;
        if (!container) return;

        // Aplica as classes no próprio container raiz no fluxo da página
        container.className = 'sticky-subnav bg-surface/95 backdrop-blur-md border-y border-outline-variant/20 shadow-xs transition-colors duration-300';
        container.innerHTML = this.renderContent(options);
    }

    /**
     * Renderizador genérico parametrizado.
     * @param {Object} options
     * @param {'home'|'category'|'product'} [options.type='home'] - Tipo de painel
     * @param {string} [options.categoryId=null] - ID da categoria (ex: 'moda-banho')
     * @param {string} [options.activeFilter='all'] - Filtro/Subcategoria ativa
     * @param {Object} [options.product=null] - Produto atual (para página de produto)
     * @returns {string} HTML renderizado com a classe sticky-subnav
     */
    static render(options = {}) {
        return `
            <div class="sticky-subnav bg-surface/95 backdrop-blur-md border-y border-outline-variant/20 shadow-xs transition-colors duration-300">
                ${this.renderContent(options)}
            </div>
        `;
    }

    /**
     * Renderiza apenas o conteúdo interno (seções e botões)
     * @param {Object} options
     * @returns {string}
     */
    static renderContent({ type = 'home', categoryId = null, activeFilter = 'all', product = null } = {}) {
        switch (type) {
            case 'home':
                return this.renderHomeContent(activeFilter);
            case 'category':
                return this.renderCategoryContent(categoryId, activeFilter);
            case 'product':
                return this.renderProductContent(product, categoryId);
            default:
                return '';
        }
    }

    /**
     * 1. Conteúdo do Painel 2 da Home (Filtro por Categorias)
     */
    static renderHomeContent(activeFilter = 'all') {
        const categories = CategoryService.getCategories();
        const chips = [];

        // Chip Destaques (all)
        const isAll = activeFilter === 'all' || activeFilter === 'destaques';
        chips.push(`
            <button data-home-filter="all" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full ${isAll ? 'bg-primary text-on-primary font-semibold shadow-xs border border-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'} font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0">
                Destaques
            </button>
        `);

        // Chips das categorias
        categories.forEach(cat => {
            const isActive = activeFilter === cat.id;
            chips.push(`
                <button data-home-filter="${cat.id}" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full ${isActive ? 'bg-primary text-on-primary font-semibold shadow-xs border border-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'} font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0">
                    ${cat.name}
                </button>
            `);
        });

        return `
            <section class="max-w-7xl mx-auto py-2 sm:py-2.5 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3">
                <div class="flex gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" id="home-category-chips">
                    ${chips.join('')}
                </div>
                <div class="w-full sm:w-auto flex justify-end pt-1 sm:pt-0">
                    <a href="moda-banho.html" class="flex items-center gap-1.5 font-label-sm text-[11px] sm:text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors duration-200">
                        <span>Catálogo Completo</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            </section>
        `;
    }

    /**
     * 2. Conteúdo do Painel 2 das Categorias (Filtro por Subcategorias)
     */
    static renderCategoryContent(categoryId, activeSub = 'all') {
        const categories = CategoryService.getCategories();
        const category = categories.find(c => c.id === categoryId) || categories[0];
        if (!category) return '';

        const chips = [];
        // Chip "Todos"
        chips.push(`
            <button data-filter-sub="all" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full ${activeSub === 'all' ? 'bg-primary text-on-primary font-semibold shadow-xs border border-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'} font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors duration-200 flex-shrink-0">
                Todos
            </button>
        `);

        // Subcategorias
        category.subcategories.filter(s => !s.highlight).forEach(sub => {
            const subUrl = new URL(sub.href, 'http://localhost');
            const subSlug = subUrl.searchParams.get('sub') || sub.name.toLowerCase();
            const isActive = activeSub === subSlug;
            chips.push(`
                <button data-filter-sub="${subSlug}" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full ${isActive ? 'bg-primary text-on-primary font-semibold shadow-xs border border-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'} font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors duration-200 flex-shrink-0">
                    ${sub.name}
                </button>
            `);
        });

        return `
            <section class="max-w-7xl mx-auto py-2 sm:py-2.5 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-3">
                <div class="flex gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" id="category-filter-chips">
                    ${chips.join('')}
                </div>
                <div class="w-full sm:w-auto flex justify-between sm:justify-end items-center pt-1 sm:pt-0 border-t border-outline-variant/15 sm:border-0 text-xs">
                    <span class="text-on-surface-variant/70 font-label-sm text-[10px] sm:hidden uppercase">Filtros</span>
                    <div class="relative group">
                        <button class="flex items-center gap-1.5 font-label-sm text-[11px] sm:text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors duration-300 py-1">
                            <span>Ordenar: Mais Vendidos</span>
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    /**
     * 3. Conteúdo do Painel 2 da Página de Produto (Breadcrumb e Subcategorias)
     */
    static renderProductContent(product, categoryId = null) {
        const categories = CategoryService.getCategories();
        const catId = categoryId || product?.category || 'moda-banho';
        const currentCategory = categories.find(c => c.id === catId) || categories[0];
        if (!currentCategory) return '';

        const chips = [];
        chips.push(`
            <a href="${currentCategory.href}?sub=all" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors duration-200 flex-shrink-0">
                Todos
            </a>
        `);

        currentCategory.subcategories.filter(s => !s.highlight).forEach(sub => {
            const subUrl = new URL(sub.href, 'http://localhost');
            const subParam = subUrl.searchParams.get('sub');
            const isActive = product && subParam === product.subcategory;
            chips.push(`
                <a href="${sub.href}" class="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full ${isActive ? 'bg-primary text-on-primary font-semibold shadow-xs border border-primary' : 'bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-primary/40'} font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap transition-colors duration-200 flex-shrink-0">
                    ${sub.name}
                </a>
            `);
        });

        const prodName = product?.name || 'Produto';

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-2 sm:py-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" id="category-sub-bar">
                    ${chips.join('')}
                </div>
                <nav class="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-wider text-on-surface-variant font-label-sm w-full sm:w-auto justify-start sm:justify-end overflow-x-auto hide-scrollbar whitespace-nowrap" id="breadcrumb-trail">
                    <a href="index.html" class="hover:text-primary transition-colors">Início</a>
                    <span>/</span>
                    <a href="${currentCategory.href}" class="hover:text-primary transition-colors">${currentCategory.name}</a>
                    <span>/</span>
                    <span class="text-on-surface font-semibold truncate max-w-[150px] sm:max-w-none">${prodName}</span>
                </nav>
            </div>
        `;
    }

    // Compatibilidade com chamadas anteriores
    static renderProductSubNav(product, currentCategory) {
        return this.renderContent({ type: 'product', product, categoryId: currentCategory?.id });
    }

    static renderCategorySubNav(category, activeSub = 'all') {
        return this.renderContent({ type: 'category', categoryId: category?.id, activeFilter: activeSub });
    }
}
