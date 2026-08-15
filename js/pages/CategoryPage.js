/**
 * CategoryPage.js
 * Lógica de montagem e filtragem dinâmica sincronizada com os submenus do Header (Painel 1)
 * e a barra de filtros (Painel 2) em todas as páginas de categoria.
 */
import { ProductService } from '../services/ProductService.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { SubNavBar } from '../components/SubNavBar.js';
import { Hero } from '../components/Hero.js';
import { HeroService } from '../services/HeroService.js';
import { $, $$, updatePillState, smoothScrollTo } from '../utils/dom.js';
import { getQueryParam, setQueryParam } from '../utils/url.js';

export class CategoryPage {
    static init(category = null) {
        const initialSub = getQueryParam('sub', 'all');

        // 1. Renderizar dinamicamente a Hero Section via Hero.mount
        if (category) {
            const heroData = HeroService.getHeroData(category);
            if (heroData) {
                Hero.mount('#hero-root', heroData);
            }
        }

        // 2. Renderizar dinamicamente o Painel 2 (SubNavBar) com sticky garantido
        if (category) {
            SubNavBar.mount('#subnav-root', {
                type: 'category',
                categoryId: category,
                activeFilter: initialSub
            });
        }

        // 3. Montar a seção do grid de produtos
        const allProducts = category ? ProductService.getByCategory(category) : ProductService.getAll();
        const gridRoot = $('#product-grid-root');
        if (gridRoot) {
            ProductGrid.mount(gridRoot, {
                gridId: 'product-grid',
                products: allProducts
            });
        }

        const filterBtns = $$('[data-filter-sub]');

        const applyFilter = (subcategory, updateUrl = false, smoothScroll = false) => {
            const targetSub = subcategory && subcategory !== '' ? subcategory : 'all';

            // Atualizar estados visuais dos botões do Painel 2
            updatePillState(filterBtns, targetSub, 'data-filter-sub');

            // Filtrar produtos e atualizar via ProductGrid
            const filtered = targetSub === 'all' 
                ? allProducts 
                : allProducts.filter(p => p.subcategory === targetSub);

            ProductGrid.updateCards('#product-grid', filtered);

            // Atualizar a URL
            if (updateUrl) {
                setQueryParam('sub', targetSub, true);
            }

            // Rolagem suave até a barra de produtos
            if (smoothScroll) {
                const filterSection = $('[data-filter-sub]')?.closest('section');
                if (filterSection) {
                    smoothScrollTo(filterSection, 80);
                }
            }
        };

        // Ouvinte de clique nos botões da barra de filtros (Painel 2)
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const subcategory = btn.getAttribute('data-filter-sub');
                applyFilter(subcategory, true, false);
            });
        });

        // Ouvinte global de cliques para capturar links do Header/Dropdown (Painel 1)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            try {
                const currentFileName = window.location.pathname.split('/').pop() || 'index.html';
                const isTargetingCurrentPage = href.startsWith(currentFileName) || 
                                              href.startsWith('?') || 
                                              (href.includes(currentFileName) && !href.startsWith('http'));

                if (isTargetingCurrentPage && href.includes('sub=')) {
                    e.preventDefault();
                    const url = new URL(href, window.location.href);
                    const subParam = url.searchParams.get('sub') || 'all';

                    applyFilter(subParam, true, true);

                    // Fechar menu mobile se estiver aberto
                    const mobileMenu = $('#mobile-menu');
                    const backdrop = $('#mobile-menu-backdrop');
                    if (mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
                        mobileMenu.classList.add('-translate-x-full', 'pointer-events-none');
                        if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
                        document.body.classList.remove('overflow-hidden');
                        setTimeout(() => {
                            mobileMenu.classList.add('invisible');
                            if (backdrop) backdrop.classList.add('invisible');
                        }, 400);
                    }
                }
            } catch (err) {
                console.error('Erro ao processar navegação interna:', err);
            }
        });

        // Ouvinte de navegação no histórico (Voltar/Avançar)
        window.addEventListener('popstate', () => {
            const subParam = getQueryParam('sub', 'all');
            applyFilter(subParam, false, false);
        });

        // Inicialização: Ler parâmetro ?sub= da URL ao carregar a página
        applyFilter(initialSub, false, false);
    }
}
