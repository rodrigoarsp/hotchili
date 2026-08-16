/**
 * HomePage.js
 * Lógica de inicialização da página inicial sem a barra intermediária de filtros.
 */
import { ProductService } from '../services/ProductService.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { Hero } from '../components/Hero.js';
import { HeroService } from '../services/HeroService.js';
import { ApiService } from '../services/ApiService.js';
import { $, showTemporaryFeedback, initScrollAnimations } from '../utils/dom.js';

export class HomePage {
    static async init() {
        // 1. Renderizar imediatamente o Hero da Home
        const initialHero = HeroService.getHeroData('home');
        Hero.mount('#hero-root', initialHero);

        // 2. Renderizar dinamicamente a Vitrine de Produtos via ProductGrid.mount
        this.initFeaturedProducts();

        // 3. Inicializar formulário da newsletter e animações
        this.initNewsletterForm();
        initScrollAnimations();

        // 4. Revalidar em tempo real direto da API MySQL
        try {
            const [liveHeroes, liveProducts] = await Promise.allSettled([
                ApiService.getHeroes(),
                ApiService.getProducts()
            ]);

            if (liveHeroes.status === 'fulfilled' && liveHeroes.value && liveHeroes.value['home']) {
                Hero.mount('#hero-root', liveHeroes.value['home']);
            }

            if (liveProducts.status === 'fulfilled' && Array.isArray(liveProducts.value) && liveProducts.value.length > 0) {
                const liveFeatured = liveProducts.value.filter(p => p.featured || p.badge || p.price > 400).slice(0, 8);
                ProductGrid.updateCards('#home-product-grid', liveFeatured);
            }
        } catch (e) {}
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
