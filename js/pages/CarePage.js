/**
 * CarePage.js
 * Controlador da Página de Atendimento & Concierge VIP.
 */
import { Hero } from '../components/Hero.js';
import { HeroService } from '../services/HeroService.js';
import { $, showTemporaryFeedback, initScrollAnimations } from '../utils/dom.js';

export class CarePage {
    static init() {
        // 1. Renderizar Hero padronizada
        Hero.mount('#hero-root', HeroService.getHeroData('atendimento'));

        const form = $('#concierge-form');
        const successMsg = $('#form-success-msg');

        if (form && successMsg) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                form.reset();
                showTemporaryFeedback(successMsg, 'Sua mensagem foi enviada com sucesso! Um de nossos consultores concierge entrará em contato em breve.', 5000);
            });
        }

        initScrollAnimations();
    }
}
