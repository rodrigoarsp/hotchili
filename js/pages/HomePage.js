/**
 * HomePage.js
 * Lógica de inicialização, vitrine dinâmica de produtos e filtros da página inicial.
 */
import { ProductService } from '../services/ProductService.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { SubNavBar } from '../components/SubNavBar.js';
import { Hero } from '../components/Hero.js';
import { HeroService } from '../services/HeroService.js';
import { $$, updatePillState, showTemporaryFeedback, initScrollAnimations, $ } from '../utils/dom.js';

export class HomePage {
    static init() {
        // 1. Renderizar dinamicamente o Hero da Home via Hero.mount
        Hero.mount('#hero-root', HeroService.getHeroData('home'));

        // 2. Renderizar dinamicamente o Painel 2 (Filtros da Home) com sticky garantido
        SubNavBar.mount('#subnav-root', { type: 'home', activeFilter: 'all' });

        // 3. Renderizar dinamicamente a Vitrine de Produtos via ProductGrid.mount
        this.initFeaturedProducts();

        // 4. Inicializar filtros rápidos e formulário da newsletter
        this.initCategoryFilters();
        this.initNewsletterForm();
        initScrollAnimations();
    }

    /**
     * Renderiza a vitrine de produtos de destaque através do ProductGrid
     */
    static initFeaturedProducts() {
        const featured = ProductService.getFeatured();
        ProductGrid.mount('#vitrine-root', {
            sectionId: 'vitrine',
            gridId: 'home-product-grid',
            badge: 'Seleção Curada',
            title: 'Os Essenciais do Sol',
            description: 'Do biquíni esculpido à saída de banho em crochê manual — peças desenhadas para elevar a sua presença.',
            products: featured
        });
    }

    /**
     * Configura os botões de filtro rápido de categoria no Painel 2 da Home
     */
    static initCategoryFilters() {
        const filterBtns = $$('[data-home-filter]');
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-home-filter') || 'all';

                // Atualiza o estado visual das pills com função compartilhada
                updatePillState(filterBtns, filter, 'data-home-filter');

                // Filtra e atualiza os produtos via ProductGrid.updateCards
                const productsToDisplay = (filter === 'all' || filter === 'destaques')
                    ? ProductService.getFeatured()
                    : ProductService.getByCategory(filter);

                ProductGrid.updateCards('#home-product-grid', productsToDisplay);
            });
        });
    }

    /**
     * Manipula a submissão do formulário do Hot Chili Club
     */
    static initNewsletterForm() {
        const form = $('#newsletter-form');
        const feedback = $('#newsletter-feedback');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                showTemporaryFeedback(feedback, 'Obrigado por se inscrever! Você receberá nossos lançamentos e convites exclusivos em breve.', 5000);
                form.reset();
            }
        });
    }
}
