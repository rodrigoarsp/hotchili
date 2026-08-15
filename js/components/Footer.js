/**
 * Footer.js
 * Componente visual do rodapé editorial escuro totalmente responsivo.
 * Links de navegação sincronizados com a estrutura de categorias do cabeçalho.
 */
import { CategoryService } from '../services/CategoryService.js';

export class Footer {
    static render() {
        const categories = CategoryService.getCategories();

        const categoryLinksHtml = categories.map(cat => `
            <li>
                <a href="${cat.href}" class="hover:text-[#efbf62] transition-colors py-1 block">
                    ${cat.name}
                </a>
            </li>
        `).join('');

        return `
            <footer class="bg-[#121212] text-on-primary w-full relative mt-16 md:mt-24 border-t border-[#222222]">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
                        <!-- Coluna 1: Marca & Redes Sociais -->
                        <div class="flex flex-col md:col-span-2 lg:col-span-1">
                            <h3 class="font-display-lg text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#efbf62] mb-4 md:mb-6">
                                HOT CHILI
                            </h3>
                            <p class="font-body-md text-gray-300 text-sm sm:text-base leading-relaxed mb-6 md:mb-8 max-w-md">
                                A marca de moda praia autoral feita para quem busca brilhar sob o sol com elegância, texturas manuais e metais nobres banhados a ouro.
                            </p>
                            <div class="flex items-center gap-3 sm:gap-4">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                                   aria-label="Instagram"
                                   class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#222222] hover:bg-[#2e2e2e] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95">
                                    <svg class="w-5 h-5 fill-[#efbf62]" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                                   aria-label="Facebook"
                                   class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#222222] hover:bg-[#2e2e2e] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95">
                                    <svg class="w-5 h-5 fill-[#efbf62]" viewBox="0 0 24 24">
                                        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                                    </svg>
                                </a>
                                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" 
                                   aria-label="TikTok"
                                   class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#222222] hover:bg-[#2e2e2e] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95">
                                    <svg class="w-5 h-5 fill-[#efbf62]" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.2a6.34 6.34 0 0 0-5.11 6.2 6.34 6.34 0 1 0 10.7-4.51v-4.1a8.2 8.2 0 0 0 4.52 1.34V6.69z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Coluna 2: Navegação & Coleções (Sincronizado com o Cabeçalho) -->
                        <div class="flex flex-col">
                            <h3 class="font-title-md text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#efbf62] mb-4 md:mb-6">
                                NAVEGAÇÃO
                            </h3>
                            <ul class="space-y-3 sm:space-y-4 font-body-md text-gray-300 text-sm sm:text-base">
                                ${categoryLinksHtml}
                            </ul>
                        </div>

                        <!-- Coluna 3: Atendimento & Concierge VIP -->
                        <div class="flex flex-col">
                            <h3 class="font-title-md text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#efbf62] mb-4 md:mb-6">
                                ATENDIMENTO
                            </h3>
                            <ul class="space-y-3 sm:space-y-4 font-body-md text-gray-300 text-sm sm:text-base">
                                <li>
                                    <a href="atendimento.html" class="hover:text-[#efbf62] transition-colors py-1 block">Fale Conosco</a>
                                </li>
                                <li>
                                    <a href="atendimento.html#faq" class="hover:text-[#efbf62] transition-colors py-1 block">Trocas e Devoluções</a>
                                </li>
                                <li>
                                    <a href="guia-tamanhos.html" class="hover:text-[#efbf62] transition-colors py-1 block">Guia de Medidas &amp; Tamanhos</a>
                                </li>
                                <li>
                                    <a href="https://wa.me/5511999999999" target="_blank" class="hover:text-[#efbf62] transition-colors py-1 block text-primary font-medium">
                                        WhatsApp VIP: (11) 99999-9999
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Rodapé inferior / Direitos autorais -->
                    <div class="mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-[#222222] text-center text-xs text-gray-400 uppercase tracking-wider safe-bottom-padding">
                        © 2026 HOT CHILI. TODOS OS DIREITOS RESERVADOS.
                    </div>
                </div>
            </footer>
        `;
    }
}
