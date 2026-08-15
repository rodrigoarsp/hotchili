/**
 * ProductPage.js
 * Controlador dinâmico da Página de Detalhe de Produto.
 */
import { ProductService } from '../services/ProductService.js';
import { CategoryService } from '../services/CategoryService.js';
import { CartService } from '../services/CartService.js';
import { CartContext } from '../context/CartContext.js';
import { SubNavBar } from '../components/SubNavBar.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { formatCurrency, formatCep } from '../utils/formatters.js';
import { getQueryParam } from '../utils/url.js';
import { $, $$, initScrollAnimations } from '../utils/dom.js';

export class ProductPage {
    static init() {
        const productId = getQueryParam('id', 'mb-01');
        const product = ProductService.getById(productId) || ProductService.getFeatured()[0];

        if (!product) return;

        let selectedSize = 'P';
        let selectedColor = product.color || 'Textured Gold';

        // 1. Atualizar Título da Página
        document.title = `${product.name} | Hot Chili Luxury Beachwear`;

        // 2. Renderizar Painel 2 (SubNavBar com Chips e Breadcrumb) com sticky garantido
        const categories = CategoryService.getCategories();
        const currentCategory = categories.find(c => c.id === product.category) || categories[0];
        SubNavBar.mount('#subnav-root', { type: 'product', product, categoryId: product.category });

        // 3. Preencher Dados do Produto
        const catLabel = $('#product-category-label');
        if (catLabel) catLabel.textContent = `${currentCategory.name} Luxury`;

        const prodTitle = $('#product-title');
        if (prodTitle) prodTitle.textContent = product.name;

        const prodPrice = $('#product-price');
        if (prodPrice) prodPrice.textContent = product.formattedPrice || formatCurrency(product.price);

        const colorName = $('#selected-color-name');
        if (colorName) colorName.textContent = selectedColor;

        const mainImg = $('#main-product-image');
        if (mainImg) mainImg.src = product.image;

        const thumb1 = $('#thumb-1');
        const thumb2 = $('#thumb-2');
        const thumb3 = $('#thumb-3');
        if (thumb1) thumb1.src = product.image;
        if (thumb2) thumb2.src = product.image;
        if (thumb3) thumb3.src = product.image;

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
            btn.addEventListener('click', () => {
                sizeButtons.forEach(b => {
                    b.classList.remove('border-primary', 'bg-primary-container', 'text-on-primary-container', 'font-bold');
                    b.classList.add('border-outline-variant', 'text-on-surface');
                });
                btn.classList.add('border-primary', 'bg-primary-container', 'text-on-primary-container', 'font-bold');
                selectedSize = btn.getAttribute('data-size') || 'P';
            });
        });

        // 5. Seletores de Cor
        const colorButtons = $$('#color-swatches button');
        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                colorButtons.forEach(b => b.classList.remove('ring-2', 'ring-offset-2', 'ring-primary'));
                btn.classList.add('ring-2', 'ring-offset-2', 'ring-primary');
                selectedColor = btn.getAttribute('data-color') || selectedColor;
                if (colorName) colorName.textContent = selectedColor;
            });
        });

        // 6. Botão Adicionar à Sacola
        const addBtn = $('#add-to-bag-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                CartService.addItem({
                    ...product,
                    size: selectedSize,
                    color: selectedColor
                }, 1);
                CartContext.openDrawer();
            });
        }

        // 7. Simulação de Cálculo de CEP
        const cepBtn = $('#cep-btn');
        const cepInput = $('#cep-input');
        const cepResult = $('#cep-result');
        if (cepBtn && cepInput && cepResult) {
            cepInput.addEventListener('input', () => {
                cepInput.value = formatCep(cepInput.value);
            });

            cepBtn.addEventListener('click', () => {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length >= 8) {
                    cepResult.classList.remove('hidden');
                }
            });
        }

        // 8. Renderizar Vitrine "Complete o Look" via ProductGrid
        const related = ProductService.getFeatured().filter(p => p.id !== product.id).slice(0, 3);
        ProductGrid.mount('#related-products-root', {
            badge: 'Curadoria Exclusiva',
            title: 'Complete o Look',
            description: 'Peças selecionadas por nossos estilistas para compor a sua produção à beira-mar.',
            columns: 3,
            products: related
        });

        initScrollAnimations();
    }
}
