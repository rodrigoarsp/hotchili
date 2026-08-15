/**
 * Hero.js
 * Componente modular unificado para renderização das Hero Sections em todas as páginas.
 * Garante padronização visual, tipografia calibrada, suporte a animações e layouts responsivos.
 */
import { $ } from '../utils/dom.js';

export class Hero {
    /**
     * Monta o Hero diretamente em um container do DOM (#hero-root).
     * @param {string|Element} target
     * @param {Object} options
     */
    static mount(target, options = {}) {
        const container = typeof target === 'string' ? $(target) : target;
        if (!container) return;
        container.innerHTML = this.render(options);
    }

    /**
     * Renderiza o HTML do Hero de acordo com os parâmetros enviados.
     * @param {Object} options
     * @param {'home'|'category'|'simple'} [options.type='category'] - Tipo de layout
     * @param {string} [options.badge] - Texto do selo/etiqueta superior (ex: 'Coleção Principal')
     * @param {string} [options.title] - Título principal da Hero
     * @param {string} [options.description] - Descrição ou subtítulo editorial
     * @param {string} [options.imageUrl] - URL da imagem de fundo
     * @param {string} [options.imageAlt] - Texto alternativo para acessibilidade
     * @param {Array<{label: string, href: string, primary?: boolean}>} [options.buttons] - Botões de CTA (para Home)
     * @returns {string} HTML renderizado da Hero
     */
    static render({
        type = 'category',
        badge = '',
        title = '',
        description = '',
        imageUrl = '',
        imageAlt = '',
        buttons = []
    } = {}) {
        if (type === 'home') {
            return this.renderHomeHero({ badge, title, description, imageUrl, imageAlt, buttons });
        }

        if (type === 'simple') {
            return this.renderSimpleHero({ badge, title, description });
        }

        return this.renderCategoryHero({ badge, title, description, imageUrl, imageAlt });
    }

    /**
     * Hero da Home (Completo com Altura Expandida, Efeito Glow e Botões)
     */
    static renderHomeHero({ badge, title, description, imageUrl, imageAlt, buttons = [] }) {
        const buttonsHtml = buttons.length ? `
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full max-w-md mx-auto fade-lift px-4 sm:px-0" style="transition-delay: 300ms;">
                ${buttons.map(b => b.primary ? `
                    <a href="${b.href}" class="btn-fluid-hover bg-on-surface text-primary-fixed-dim font-label-sm text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 sm:py-4 rounded-full w-full sm:w-auto text-center border border-transparent shadow-[0_10px_30px_rgba(123,88,0,0.15)] active:scale-95">
                        <span>${b.label}</span>
                    </a>
                ` : `
                    <a href="${b.href}" class="border border-outline/40 bg-surface/80 backdrop-blur-md text-on-surface hover:bg-surface-container font-label-sm text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 sm:py-4 rounded-full w-full sm:w-auto text-center transition-all duration-300 shadow-xs active:scale-95">
                        ${b.label}
                    </a>
                `).join('')}
            </div>
        ` : '';

        return `
            <section class="relative w-full min-h-[75vh] sm:min-h-[85vh] lg:h-[90vh] flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-0">
                <div class="absolute inset-0 z-0">
                    <img alt="${imageAlt || title}" class="w-full h-full object-cover object-center zoom-img" src="${imageUrl}"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-surface/20"></div>
                </div>

                <div class="relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-12 max-w-4xl mx-auto flex flex-col items-center">
                    ${badge ? `
                        <span class="inline-flex items-center gap-2 font-label-sm text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary font-bold mb-3 sm:mb-4 bg-surface/90 backdrop-blur-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-primary/20 shadow-xs fade-lift">
                            <span class="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                            ${badge}
                        </span>
                    ` : ''}
                    
                    <h1 class="font-display-lg text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-on-surface mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] drop-shadow-md fade-lift" style="transition-delay: 100ms;">
                        ${title}
                    </h1>

                    <p class="font-body-lg text-sm sm:text-base md:text-lg lg:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8 sm:mb-10 drop-shadow-xs fade-lift px-2" style="transition-delay: 200ms;">
                        ${description}
                    </p>

                    ${buttonsHtml}
                </div>
            </section>
        `;
    }

    /**
     * Hero das Páginas de Categoria (Padronizado com Altura Proporcional, Imagem com Blur e Textos Tipográficos)
     */
    static renderCategoryHero({ badge, title, description, imageUrl, imageAlt }) {
        return `
            <section class="w-full min-h-[30vh] sm:min-h-[40vh] lg:h-[48vh] relative flex items-center justify-center overflow-hidden py-10 sm:py-14">
                <div class="absolute inset-0 z-0">
                    <img alt="${imageAlt || title}" class="w-full h-full object-cover object-center zoom-img" src="${imageUrl}"/>
                    <div class="absolute inset-0 bg-surface/30 backdrop-blur-[2px]"></div>
                </div>
                <div class="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
                    ${badge ? `
                        <span class="font-label-sm text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.25em] block mb-2 sm:mb-3">
                            ${badge}
                        </span>
                    ` : ''}
                    <h1 class="font-display-lg text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface mb-2 sm:mb-3 leading-tight drop-shadow-sm">
                        ${title}
                    </h1>
                    <p class="font-body-md text-xs sm:text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto drop-shadow-xs px-2">
                        ${description}
                    </p>
                </div>
            </section>
        `;
    }

    /**
     * Hero Simples / Editorial para Páginas Institucionais (Guia de Tamanhos, Atendimento)
     */
    static renderSimpleHero({ badge, title, description }) {
        return `
            <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 px-2">
                ${badge ? `
                    <span class="font-label-sm text-xs text-primary font-bold uppercase tracking-[0.25em]">
                        ${badge}
                    </span>
                ` : ''}
                <h1 class="font-display-lg text-2xl sm:text-4xl md:text-5xl text-on-surface font-bold">
                    ${title}
                </h1>
                <p class="font-body-md text-on-surface-variant leading-relaxed text-xs sm:text-sm md:text-base">
                    ${description}
                </p>
            </div>
        `;
    }
}
