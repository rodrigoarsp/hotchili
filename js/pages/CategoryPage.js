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
import { ApiService } from '../services/ApiService.js';
import { $, $$, updatePillState, smoothScrollTo } from '../utils/dom.js';
import { getQueryParam, setQueryParam } from '../utils/url.js';

export class CategoryPage {
    static async init(category = null) {
        const initialSub = getQueryParam('sub', 'all');

        // 1. Renderizar imediatamente a Hero Section via Hero.mount
        if (category) {
            const heroData = HeroService.getHeroData(category);
            if (heroData) {
                Hero.mount('#hero-root', heroData);
            }
        }

        // 2. Renderizar dinamicamente o Painel 2 (SubNavBar)
        if (category) {
            SubNavBar.mount('#subnav-root', {
                type: 'category',
                categoryId: category,
                activeFilter: initialSub
            });
        }

        // 3. Montar a seção do grid de produtos
        let allProducts = category ? ProductService.getByCategory(category) : ProductService.getAll();
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
                setQueryParam('sub', targetSub);
            }

            // Scroll suave
            if (smoothScroll) {
                smoothScrollTo('#vitrine-produtos', 120);
            }
        };

        // 4. Registrar cliques nos botões de subcategoria do Painel 2
        if (filterBtns.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const subcategory = btn.getAttribute('data-filter-sub') || 'all';
                    applyFilter(subcategory, true, false);
                });
            });
        }

        // 5. Aplicar filtro inicial da URL
        if (initialSub && initialSub !== 'all') {
            applyFilter(initialSub, false, false);
        }

        // 6. Sincronizar em tempo real com a API MySQL
        try {
            const [liveHeroes, liveProducts] = await Promise.allSettled([
                ApiService.getHeroes(),
                ApiService.getProducts(category ? { category } : {})
            ]);

            if (category && liveHeroes.status === 'fulfilled' && liveHeroes.value && liveHeroes.value[category]) {
                Hero.mount('#hero-root', liveHeroes.value[category]);
            }

            if (liveProducts.status === 'fulfilled' && Array.isArray(liveProducts.value) && liveProducts.value.length > 0) {
                allProducts = category 
                    ? liveProducts.value.filter(p => p.category === category || p.category_id === category)
                    : liveProducts.value;

                applyFilter(getQueryParam('sub', 'all'), false, false);
            }
        } catch (e) {}
    }
}
