/**
 * ProductPage.js
 * Controlador dinâmico da Página de Detalhe de Produto com sincronização em tempo real via MySQL.
 */
import { ProductService } from '../services/ProductService.js';
import { CategoryService } from '../services/CategoryService.js';
import { CartService } from '../services/CartService.js';
import { CartContext } from '../context/CartContext.js';
import { SubNavBar } from '../components/SubNavBar.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { ApiService } from '../services/ApiService.js';
import { formatCurrency, formatCep, formatImageUrl } from '../utils/formatters.js';
import { getQueryParam } from '../utils/url.js';
import { $, $$, initScrollAnimations } from '../utils/dom.js';

export class ProductPage {
    static async init() {
        const productId = getQueryParam('id', 'mb-01');
        let product = ProductService.getById(productId) || ProductService.getFeatured()[0];

        // 1. Renderizar inicialmente (com dados síncronos se existirem)
        if (product) {
            this.renderProductDetails(product);
        }

        // 2. Revalidar em tempo real direto da API MySQL
        try {
            const liveProducts = await ApiService.getProducts();
            if (Array.isArray(liveProducts) && liveProducts.length > 0) {
                const found = liveProducts.find(p => String(p.id) === String(productId));
                if (found) {
                    product = found;
                    this.renderProductDetails(product);
                }

                // Renderizar Produtos Relacionados ("Complete o Look")
                const related = liveProducts.filter(p => (p.category === product.category || p.category_id === product.category_id) && String(p.id) !== String(product.id)).slice(0, 4);
                if (related.length > 0) {
                    ProductGrid.mount('#related-products-root', {
                        title: 'Complete o Seu Visual',
                        badge: 'Recomendações da Curadoria',
                        description: 'Peças selecionadas que harmonizam com elegância para compor sua produção à beira-mar.',
                        products: related
                    });
                }
            }
        } catch (e) {}

        initScrollAnimations();
    }

    static renderProductDetails(product) {
        if (!product) return;

        let selectedSize = 'P';
        let selectedColor = product.color || 'Textured Gold';
        const safeImageUrl = formatImageUrl(product.image);

        // 1. Atualizar Título da Página
        document.title = `${product.name} | Hot Chili Luxury Beachwear`;

        // 2. Renderizar Painel 2 (SubNavBar com Chips e Breadcrumb)
        const categories = CategoryService.getCategories();
        const currentCategory = categories.find(c => c.id === (product.category || product.category_id)) || categories[0];
        SubNavBar.mount('#subnav-root', { type: 'product', product, categoryId: product.category || product.category_id });

        // 3. Preencher Dados do Produto
        const catLabel = $('#product-category-label');
        if (catLabel) catLabel.textContent = `${currentCategory.name} Luxury`;

        const prodTitle = $('#product-title');
        if (prodTitle) prodTitle.textContent = product.name;

        const prodPrice = $('#product-price');
        if (prodPrice) prodPrice.textContent = product.formattedPrice || formatCurrency(product.price);

        const colorName = $('#selected-color-name');
        if (colorName) colorName.textContent = selectedColor;

        // Imagem Principal
        const mainImg = $('#main-product-image');
        if (mainImg) {
            mainImg.src = safeImageUrl;
            mainImg.onerror = () => {
                mainImg.src = 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';
            };
        }

        // Thumbnails
        const thumb1 = $('#thumb-1');
        const thumb2 = $('#thumb-2');
        const thumb3 = $('#thumb-3');
        [thumb1, thumb2, thumb3].forEach(t => {
            if (t) {
                t.src = safeImageUrl;
                t.onerror = () => {
                    t.src = 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';
                };
            }
        });

        const badgeEl = $('#product-badge');
        if (badgeEl) {
            if (product.badge) {
                badgeEl.textContent = product.badge;
                badgeEl.classList.remove('hidden');
            } else {
                badgeEl.classList.add('hidden');
            }
        }

        // 4. Seletores de Tamanho
        const sizeButtons = $$('.size-btn');
        sizeButtons.forEach(btn => {
            btn.onclick = () => {
                sizeButtons.forEach(b => {
                    b.classList.remove('border-primary', 'bg-primary-container', 'text-on-primary-container', 'font-bold');
                    b.classList.add('border-outline-variant', 'text-on-surface');
                });
                btn.classList.add('border-primary', 'bg-primary-container', 'text-on-primary-container', 'font-bold');
                selectedSize = btn.getAttribute('data-size') || 'P';
            };
        });

        // 5. Seletores de Cor
        const colorButtons = $$('#color-swatches button');
        colorButtons.forEach(btn => {
            btn.onclick = () => {
                colorButtons.forEach(b => b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary'));
                btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
                selectedColor = btn.getAttribute('data-color') || selectedColor;
                if (colorName) colorName.textContent = selectedColor;
            };
        });

        // 6. Botão Adicionar à Sacola
        const addToBagBtn = $('#add-to-bag-btn');
        if (addToBagBtn) {
            addToBagBtn.onclick = () => {
                CartService.addItem(product, selectedSize, selectedColor);
                CartContext.open();
            };
        }

        // 7. Cálculo de Frete
        const cepInput = $('#cep-input');
        const calcCepBtn = $('#calc-cep-btn');
        const cepResult = $('#cep-result');
        const cepFeedback = $('#cep-feedback');

        if (calcCepBtn && cepInput) {
            calcCepBtn.onclick = () => {
                const cep = formatCep(cepInput.value);
                if (cep.replace(/\D/g, '').length === 8) {
                    if (cepResult) cepResult.classList.remove('hidden');
                    if (cepFeedback) {
                        cepFeedback.textContent = `Frete calculado com sucesso para o CEP ${cep}`;
                        cepFeedback.classList.remove('hidden');
                    }
                } else {
                    if (cepFeedback) {
                        cepFeedback.textContent = 'Por favor, informe um CEP válido com 8 dígitos.';
                        cepFeedback.classList.remove('hidden');
                    }
                }
            };
        }
    }
}
