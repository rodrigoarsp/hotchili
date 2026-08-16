/**
 * app.js
 * Ponto de entrada e orquestrador global da arquitetura modular Hot Chili.
 */
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { CartContext } from './context/CartContext.js';
import { NavigationContext } from './context/NavigationContext.js';
import { HomePage } from './pages/HomePage.js';
import { CategoryPage } from './pages/CategoryPage.js';
import { ProductPage } from './pages/ProductPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { CarePage } from './pages/CarePage.js';
import { SizeGuidePage } from './pages/SizeGuidePage.js';
import { ApiService } from './services/ApiService.js';
import { getPageId } from './utils/url.js';
import { initScrollAnimations } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', async () => {
    const pageId = getPageId();

    // 0. Sincronizar dados em background com o MySQL / API Headless
    try {
        await Promise.allSettled([
            ApiService.getProducts(),
            ApiService.getHeroes()
        ]);
    } catch (e) {}

    // 1. Renderizar Header Global (exceto no Checkout minimalista)
    const headerRoot = document.getElementById('header-root');
    if (headerRoot && pageId !== 'checkout') {
        headerRoot.innerHTML = Header.render(pageId);
    }

    // 2. Renderizar Footer Global (exceto no Checkout minimalista)
    const footerRoot = document.getElementById('footer-root');
    if (footerRoot && pageId !== 'checkout') {
        footerRoot.innerHTML = Footer.render();
    }

    // 3. Inicializar Contextos Globais (Navegação & Carrinho)
    NavigationContext.init();
    CartContext.init();

    // 4. Despachar Inicialização para o Controlador Específico da Página
    const categoryPages = ['moda-banho', 'resort-sunset', 'kids', 'acessorios', 'protecao-solar'];

    if (categoryPages.includes(pageId)) {
        CategoryPage.init(pageId);
    } else {
        switch (pageId) {
            case 'home':
            case 'index':
                HomePage.init();
                break;
            case 'produto':
                ProductPage.init();
                break;
            case 'checkout':
                CheckoutPage.init();
                break;
            case 'atendimento':
                CarePage.init();
                break;
            case 'guia-tamanhos':
                SizeGuidePage.init();
                break;
            default:
                break;
        }
    }

    // 5. Ativar animações de scroll globalmente
    initScrollAnimations();
});
