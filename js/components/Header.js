/**
 * Header.js
 * Componente do cabeçalho editorial responsivo (Desktop, Tablet e Mobile).
 */
import { CategoryService } from '../services/CategoryService.js';
import { CartService } from '../services/CartService.js';

export class Header {
    static render(activePageId = 'home') {
        const categories = CategoryService.getCategories();
        const cartCount = CartService.getItemCount();

        const navItemsHtml = categories.map(cat => {
            const isActive = cat.id === activePageId;
            const linkClass = isActive
                ? 'font-label-sm text-[12px] xl:text-[13px] text-primary font-bold uppercase tracking-[0.15em] flex items-center whitespace-nowrap'
                : 'font-label-sm text-[12px] xl:text-[13px] text-on-surface-variant hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em] font-medium flex items-center whitespace-nowrap';

            const subItemsHtml = cat.subcategories.map(sub => `
                <li><a class="font-label-sm text-sm text-on-surface-variant hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 ${sub.highlight ? 'text-primary font-bold uppercase tracking-wider' : ''}" href="${sub.href}">${sub.name}</a></li>
            `).join('');

            return `
                <div class="group relative py-2">
                    <a href="${cat.href}" class="${linkClass}">
                        ${cat.name}
                        <span class="material-symbols-outlined text-sm ml-1 transition-transform group-hover:rotate-180">expand_more</span>
                    </a>
                    <div class="dropdown-menu absolute left-1/2 -translate-x-1/2 top-full mt-0 w-64 bg-surface/95 backdrop-blur-md border border-primary/10 shadow-xl rounded-b-xl pt-4 pb-6 px-6">
                        <div class="w-full h-1 bg-primary/20 absolute top-0 left-0"></div>
                        <ul class="space-y-3">
                            ${subItemsHtml}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <!-- Main Desktop Header (>= 1024px) -->
            <header class="bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm shadow-primary/5 fixed top-0 w-full z-50 transition-all duration-300 hidden lg:block">
                <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-12 py-3">
                    <!-- Left: Brand Identity -->
                    <a href="index.html" class="flex flex-col items-center flex-shrink-0 hover:opacity-80 transition-opacity duration-300 min-w-[140px]">
                        <span class="font-display-lg text-[24px] xl:text-[26px] tracking-[0.2em] text-on-surface font-bold leading-tight">HOT CHILI</span>
                        <span class="font-label-sm text-[9px] text-on-surface-variant tracking-[0.3em] uppercase mt-0.5 font-medium">— MODA PRAIA —</span>
                    </a>
                    <!-- Center: Navigation with Dropdowns -->
                    <nav class="flex items-center gap-6 xl:gap-8">
                        ${navItemsHtml}
                    </nav>
                    <!-- Right: Action Icons -->
                    <div class="flex items-center gap-4 xl:gap-5 flex-shrink-0">
                        <a href="atendimento.html" aria-label="Atendimento VIP" title="Atendimento VIP" class="text-on-surface-variant hover:text-primary transition-colors duration-300 p-2">
                            <span class="material-symbols-outlined text-[22px]">support_agent</span>
                        </a>
                        <button id="cart-toggle-btn" aria-label="Shopping Bag" class="text-on-surface-variant hover:text-primary transition-colors duration-300 relative p-2">
                            <span class="material-symbols-outlined text-[22px]">shopping_bag</span>
                            <span id="cart-badge-count" class="absolute 0 right-0 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">${cartCount}</span>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Mobile & Tablet Header (< 1024px) -->
            <header class="bg-surface/85 backdrop-blur-xl border-b border-primary/10 shadow-sm fixed top-0 w-full z-50 transition-all duration-300 lg:hidden">
                <div class="flex justify-between items-center px-4 sm:px-6 py-3.5 max-w-7xl mx-auto">
                    <button aria-label="Abrir Menu" class="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors rounded-full active:bg-surface-variant/50" id="mobile-menu-btn">
                        <span class="material-symbols-outlined text-2xl">menu</span>
                    </button>
                    <a class="flex flex-col items-center flex-shrink-0 hover:opacity-80 transition-opacity" href="index.html">
                        <span class="font-display-lg text-xl sm:text-2xl tracking-[0.2em] text-on-surface font-bold leading-tight">HOT CHILI</span>
                        <span class="font-label-sm text-[8px] sm:text-[9px] text-on-surface-variant tracking-[0.3em] uppercase font-medium">— MODA PRAIA —</span>
                    </a>
                    <button id="mobile-cart-toggle-btn" aria-label="Shopping Bag" class="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors relative rounded-full active:bg-surface-variant/50">
                        <span class="material-symbols-outlined text-2xl">shopping_bag</span>
                        <span id="mobile-cart-badge-count" class="absolute top-1 right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">${cartCount}</span>
                    </button>
                </div>
            </header>

            <!-- Mobile & Tablet Backdrop -->
            <div id="mobile-menu-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 opacity-0 invisible pointer-events-none transition-all duration-300 lg:hidden"></div>

            <!-- Mobile & Tablet Slide-out Drawer Menu -->
            <aside id="mobile-menu" class="fixed top-0 left-0 h-full w-full max-w-sm sm:max-w-md bg-surface shadow-2xl z-50 transform -translate-x-full invisible pointer-events-none transition-all duration-400 ease-out-quint flex flex-col lg:hidden" aria-label="Menu de Navegação Mobile">
                <!-- Header do Menu -->
                <div class="flex justify-between items-center px-6 py-4 border-b border-outline-variant/30">
                    <div class="flex flex-col">
                        <span class="font-display-lg text-lg tracking-[0.18em] text-on-surface font-bold">HOT CHILI</span>
                        <span class="font-label-sm text-[8px] text-on-surface-variant tracking-[0.25em] uppercase font-medium">Menu Principal</span>
                    </div>
                    <button id="mobile-menu-close-btn" class="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full active:bg-surface-variant" aria-label="Fechar Menu">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <!-- Conteúdo do Menu com Scroll Independente -->
                <div class="flex-grow overflow-y-auto px-6 py-5 space-y-6 hide-scrollbar">
                    <nav class="space-y-3">
                        ${categories.map(c => `
                            <div class="border-b border-outline-variant/20 pb-3">
                                <a href="${c.href}" class="mobile-nav-link font-display-lg text-lg text-on-surface uppercase tracking-wider block py-2 font-bold hover:text-primary transition-colors">
                                    ${c.name}
                                </a>
                                <div class="pl-3 space-y-2 mt-1">
                                    ${c.subcategories.map(s => `
                                        <a href="${s.href}" class="mobile-nav-link block py-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors">
                                            ${s.name}
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </nav>

                    <!-- Links Rápidos de Suporte no Menu -->
                    <div class="pt-2 space-y-3">
                        <a href="guia-tamanhos.html" class="mobile-nav-link flex items-center gap-3 py-2 text-sm text-on-surface font-medium hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-primary text-xl">straighten</span>
                            Guia de Tamanhos &amp; Medidas
                        </a>
                        <a href="atendimento.html" class="mobile-nav-link flex items-center gap-3 py-2 text-sm text-on-surface font-medium hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-primary text-xl">support_agent</span>
                            Atendimento VIP &amp; FAQ
                        </a>
                    </div>
                </div>

                <!-- Footer do Menu Mobile -->
                <div class="p-6 border-t border-outline-variant/30 bg-surface-container-low text-xs text-on-surface-variant text-center space-y-2 safe-bottom-padding">
                    <p class="font-medium text-primary">Frete Grátis acima de R$ 399 para todo o Brasil</p>
                    <p class="text-[11px] opacity-70">© 2026 Hot Chili Luxury Beachwear</p>
                </div>
            </aside>
        `;
    }

    static updateBadge(count) {
        const desktopBadge = document.getElementById('cart-badge-count');
        const mobileBadge = document.getElementById('mobile-cart-badge-count');
        if (desktopBadge) desktopBadge.textContent = count;
        if (mobileBadge) mobileBadge.textContent = count;
    }
}
