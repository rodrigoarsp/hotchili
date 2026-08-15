/**
 * ProductGrid.js
 * Componente modular unificado para renderização de Vitrines e Grids de Produtos em todo o site.
 * Suporta cabeçalhos de seção, grid responsivo, estados vazios e micro-interações do carrinho.
 */
import { formatCurrency } from '../utils/formatters.js';
import { $ } from '../utils/dom.js';

export class ProductGrid {
    /**
     * Monta uma seção completa de grid de produtos em um container.
     * @param {string|Element} target 
     * @param {Object} options 
     */
    static mount(target, options = {}) {
        const container = typeof target === 'string' ? $(target) : target;
        if (!container) return;
        container.innerHTML = this.render(options);
    }

    /**
     * Atualiza apenas os cards de produto em um container existente (#product-grid).
     * @param {string|Element} target 
     * @param {Array} products 
     */
    static updateCards(target, products = []) {
        const container = typeof target === 'string' ? $(target) : target;
        if (!container) return;
        container.innerHTML = this.renderCards(products);
    }

    /**
     * Renderiza a seção completa (Container + Cabeçalho opcional + Grid de Cards).
     * @param {Object} options
     * @param {Array} [options.products=[]] - Lista de produtos
     * @param {string} [options.gridId='product-grid'] - ID do container interno de grid
     * @param {string} [options.sectionId=''] - ID da seção
     * @param {string} [options.badge=''] - Selo superior da seção
     * @param {string} [options.title=''] - Título da vitrine
     * @param {string} [options.description=''] - Descrição editorial
     * @param {Object} [options.seeAllLink=null] - Link 'Ver todos' { label, href }
     * @param {number} [options.columns=4] - Número máximo de colunas no desktop (3 ou 4)
     * @returns {string} HTML renderizado da seção
     */
    static render({
        products = [],
        gridId = 'product-grid',
        sectionId = '',
        badge = '',
        title = '',
        description = '',
        seeAllLink = null,
        columns = 4
    } = {}) {
        const hasHeader = badge || title || description || seeAllLink;
        const gridColsClass = columns === 3 
            ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8'
            : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8';

        const headerHtml = hasHeader ? this.renderHeader({ badge, title, description, seeAllLink }) : '';

        return `
            <section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 ${hasHeader ? 'pt-8 sm:pt-12' : 'pt-6 sm:pt-8'} pb-12 sm:pb-16" ${sectionId ? `id="${sectionId}"` : ''}>
                ${headerHtml}
                <div id="${gridId}" class="${gridColsClass}">
                    ${this.renderCards(products)}
                </div>
            </section>
        `;
    }

    /**
     * Renderiza o cabeçalho editorial da seção
     */
    static renderHeader({ badge, title, description, seeAllLink }) {
        if (seeAllLink) {
            return `
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-2 fade-lift">
                    <div>
                        ${badge ? `<span class="font-label-sm text-[10px] sm:text-xs text-primary uppercase tracking-[0.2em] font-bold block mb-1">${badge}</span>` : ''}
                        ${title ? `<h2 class="font-display-lg text-xl sm:text-2xl md:text-3xl text-on-surface font-bold">${title}</h2>` : ''}
                        ${description ? `<p class="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1 max-w-xl">${description}</p>` : ''}
                    </div>
                    <a href="${seeAllLink.href}" class="text-xs uppercase tracking-wider text-primary font-bold font-label-sm hover:underline underline-offset-4 flex items-center gap-1">
                        <span>${seeAllLink.label}</span>
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            `;
        }

        return `
            <div class="mb-8 sm:mb-12 text-center max-w-3xl mx-auto fade-lift px-2">
                ${badge ? `<span class="text-primary font-label-sm text-xs uppercase tracking-widest font-bold block mb-2">${badge}</span>` : ''}
                ${title ? `<h2 class="font-display-lg text-2xl sm:text-3xl md:text-4xl text-on-surface mb-2 sm:mb-3 font-bold">${title}</h2>` : ''}
                ${description ? `<p class="font-body-md text-on-surface-variant text-xs sm:text-sm md:text-base">${description}</p>` : ''}
            </div>
        `;
    }

    /**
     * Renderiza a lista de cards de produtos
     * @param {Array} products 
     * @returns {string}
     */
    static renderCards(products = []) {
        if (!products || products.length === 0) {
            return `
                <div class="col-span-full py-16 text-center text-on-surface-variant space-y-3">
                    <span class="material-symbols-outlined text-4xl text-primary/60">search_off</span>
                    <p class="font-body-md text-base">Nenhuma peça encontrada nesta seleção no momento.</p>
                    <a href="?sub=all" class="font-label-sm text-xs text-primary font-bold uppercase tracking-wider underline underline-offset-4">Ver todas as peças</a>
                </div>
            `;
        }

        return products.map(product => this.renderSingleCard(product)).join('');
    }

    /**
     * Renderiza um card individual de produto
     * @param {Object} product 
     * @returns {string}
     */
    static renderSingleCard(product) {
        const displayPrice = product.formattedPrice || formatCurrency(product.price);
        return `
            <article class="group cursor-pointer product-card flex flex-col h-full" data-product-id="${product.id}">
                <div class="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-3 sm:mb-4 shadow-[0_8px_20px_-10px_rgba(123,88,0,0.06)] rounded-sm">
                    <a href="produto.html?id=${product.id}" class="block w-full h-full">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover zoom-img transition-transform duration-700 ease-out-quint group-hover:scale-105" />
                    </a>
                    
                    ${product.badge ? `
                        <div class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-primary/95 text-on-primary font-label-sm text-[9px] sm:text-[10px] uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-sm shadow-xs pointer-events-none">
                            ${product.badge}
                        </div>
                    ` : ''}

                    <div class="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                        <button aria-label="Favoritar" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface/75 backdrop-blur-xs flex items-center justify-center text-primary hover:text-primary-container transition-colors shadow-xs">
                            <span class="material-symbols-outlined text-sm sm:text-base">favorite_border</span>
                        </button>
                    </div>

                    <!-- Botão Adicionar à Sacola: Desktop (Hover) e Mobile (Tap) -->
                    <div class="hidden sm:block">
                        <button data-add-to-cart="${product.id}" class="add-to-cart-btn absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-on-surface/95 text-primary-fixed-dim font-label-sm text-xs uppercase tracking-widest py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out-quint hover:bg-primary z-20 shadow-md rounded-xs">
                            Adicionar à Sacola
                        </button>
                    </div>
                    <div class="sm:hidden absolute bottom-2 right-2 z-20">
                        <button data-add-to-cart="${product.id}" class="add-to-cart-btn w-9 h-9 rounded-full bg-on-surface/90 text-primary-fixed-dim flex items-center justify-center shadow-md active:bg-primary transition-colors" aria-label="Adicionar à Sacola">
                            <span class="material-symbols-outlined text-lg">add_shopping_bag</span>
                        </button>
                    </div>
                </div>
                
                <div class="flex flex-col flex-grow justify-between gap-1">
                    <div>
                        <a href="produto.html?id=${product.id}" class="block">
                            <h3 class="font-display-lg text-sm sm:text-base text-on-surface font-bold line-clamp-1 hover:text-primary transition-colors">${product.name}</h3>
                        </a>
                        <p class="font-body-md text-on-surface-variant text-xs sm:text-sm mt-0.5">${product.color || ''}</p>
                    </div>
                    <div class="pt-1 flex items-baseline justify-between gap-2">
                        <span class="font-body-lg text-xs sm:text-sm md:text-base text-primary font-bold">${displayPrice}</span>
                        <span class="text-[10px] sm:text-xs text-on-surface-variant/70 font-body-md hidden xs:inline">até 6x s/ juros</span>
                    </div>
                </div>
            </article>
        `;
    }
}
