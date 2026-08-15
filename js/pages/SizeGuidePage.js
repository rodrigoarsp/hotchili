/**
 * SizeGuidePage.js
 * Controlador da Página Guia de Tamanhos & Medidas.
 */
import { Hero } from '../components/Hero.js';
import { HeroService } from '../services/HeroService.js';
import { $, setupTabs, initScrollAnimations } from '../utils/dom.js';

export class SizeGuidePage {
    static init() {
        // 1. Renderizar Hero padronizada
        Hero.mount('#hero-root', HeroService.getHeroData('guia-tamanhos'));

        const tabFem = $('#tab-fem');
        const tabMasc = $('#tab-masc');
        const tabKids = $('#tab-kids');

        const tableFem = $('#table-fem');
        const tableMasc = $('#table-masc');
        const tableKids = $('#table-kids');

        if (tabFem && tabMasc && tabKids) {
            setupTabs({
                tabButtons: [tabFem, tabMasc, tabKids],
                tabPanels: [tableFem, tableMasc, tableKids],
                activeBtnClass: 'bg-primary text-on-primary font-semibold shadow-xs border-primary',
                inactiveBtnClass: 'bg-transparent text-on-surface-variant hover:text-on-surface border-outline-variant/30 hover:border-primary/40'
            });
        }

        initScrollAnimations();
    }
}
