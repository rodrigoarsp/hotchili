/**
 * ProductPage.js
 * Controlador dinâmico da Página de Detalhe de Produto com sincronização em tempo real via MySQL
 * e Galeria Dinâmica Multi-Fotos com seleção interativa de miniaturas.
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

        // 1. Renderizar inicialmente com dados síncronos
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

        // Obter lista de fotos da galeria
        let rawGallery = [];
        if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
            rawGallery = product.gallery;
        } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            rawGallery = product.images;
        } else if (product.image) {
            rawGallery = [product.image];
        }

        const galleryList = rawGallery.map(img => formatImageUrl(img));
        const initialCover = galleryList[0] || formatImageUrl(product.image);

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

        // 4. Imagem Principal & Galeria de Miniaturas
        const mainImg = $('#main-product-image');
        if (mainImg) {
            mainImg.src = initialCover;
            mainImg.onerror = () => {
                mainImg.src = 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';
            };
        }

        // Renderizar Miniaturas Dinâmicas
        const thumbsContainer = $('#product-thumbnails');
        if (thumbsContainer) {
            thumbsContainer.innerHTML = galleryList.map((imgUrl, idx) => `
                <button class="thumb-btn border-2 ${idx === 0 ? 'border-primary shadow-sm' : 'border-transparent hover:border-primary/50'} rounded-sm overflow-hidden w-16 h-22 sm:w-20 sm:h-28 bg-surface-container flex-shrink-0 transition-all duration-300 active:scale-95 cursor-pointer" data-gallery-img="${imgUrl}">
                    <img src="${imgUrl}" alt="${product.name} - Foto ${idx + 1}" onerror="this.onerror=null; this.src='https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';" class="w-full h-full object-cover"/>
                </button>
            `).join('');

            const thumbBtns = thumbsContainer.querySelectorAll('.thumb-btn');
            thumbBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    thumbBtns.forEach(b => {
                        b.classList.remove('border-primary', 'shadow-sm');
                        b.classList.add('border-transparent');
                    });
                    btn.classList.remove('border-transparent');
                    btn.classList.add('border-primary', 'shadow-sm');
                    
                    const targetSrc = btn.getAttribute('data-gallery-img');
                    if (mainImg && targetSrc) {
                        mainImg.style.opacity = '0.5';
                        setTimeout(() => {
                            mainImg.src = targetSrc;
                            mainImg.style.opacity = '1';
                        }, 100);
                    }
                });
            });
        }

        const badgeEl = $('#product-badge');
        if (badgeEl) {
            if (product.badge) {
                badgeEl.textContent = product.badge;
                badgeEl.classList.remove('hidden');
            } else {
                badgeEl.classList.add('hidden');
            }
        }

        // 5. Seletores de Tamanho
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

        // 6. Seletores de Cor
        const colorButtons = $$('#color-swatches button');
        colorButtons.forEach(btn => {
            btn.onclick = () => {
                colorButtons.forEach(b => b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary'));
                btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
                selectedColor = btn.getAttribute('data-color') || selectedColor;
                if (colorName) colorName.textContent = selectedColor;
            };
        });

        // 7. Botão Adicionar à Sacola
        const addToBagBtn = $('#add-to-bag-btn');
        if (addToBagBtn) {
            addToBagBtn.onclick = () => {
                CartService.addItem(product, selectedSize, selectedColor);
                CartContext.open();
            };
        }

        // 8. Cálculo de Frete
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
