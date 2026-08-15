/**
 * CartContext.js
 * Contexto de gerenciamento de estado e eventos globais do carrinho.
 */
import { CartService } from '../services/CartService.js';
import { CartDrawer } from '../components/CartDrawer.js';
import { Header } from '../components/Header.js';
import { ProductService } from '../services/ProductService.js';

export class CartContext {
    static init() {
        this.renderCartDrawer();
        this.bindEvents();

        // Inscreve nos eventos do CartService
        CartService.subscribe((state) => {
            Header.updateBadge(state.count);
            this.renderCartDrawer();
        });
    }

    static #closeTimeout = null;

    static renderCartDrawer() {
        let container = document.getElementById('cart-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'cart-root';
            document.body.appendChild(container);
        }
        
        const existingDrawer = document.getElementById('cart-drawer');
        const wasOpen = existingDrawer && 
                       !existingDrawer.classList.contains('translate-x-full') && 
                       !existingDrawer.classList.contains('invisible');

        container.innerHTML = CartDrawer.render();
        this.bindDrawerEvents();

        if (wasOpen) {
            this.openDrawer();
        }
    }

    static openDrawer() {
        if (this.#closeTimeout) {
            clearTimeout(this.#closeTimeout);
            this.#closeTimeout = null;
        }

        const drawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-drawer-backdrop');
        if (drawer && backdrop) {
            backdrop.classList.remove('invisible', 'pointer-events-none');
            drawer.classList.remove('invisible', 'pointer-events-none');

            // Forçar reflow para ativar animação CSS suave
            void drawer.offsetWidth;

            backdrop.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }
    }

    static closeDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-drawer-backdrop');
        if (drawer && backdrop) {
            backdrop.classList.add('opacity-0', 'pointer-events-none');
            drawer.classList.add('translate-x-full', 'pointer-events-none');

            if (this.#closeTimeout) clearTimeout(this.#closeTimeout);
            this.#closeTimeout = setTimeout(() => {
                drawer.classList.add('invisible');
                backdrop.classList.add('invisible');
                this.#closeTimeout = null;
            }, 500);
        }
    }

    static bindEvents() {
        document.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('#cart-toggle-btn, #mobile-cart-toggle-btn');
            if (toggleBtn) {
                e.preventDefault();
                this.openDrawer();
            }

            const addBtn = e.target.closest('[data-add-to-cart]');
            if (addBtn) {
                e.preventDefault();
                const productId = addBtn.getAttribute('data-add-to-cart');
                const product = ProductService.getById(productId);
                if (product) {
                    CartService.addItem(product, 1);
                    this.openDrawer();
                }
            }
        });
    }

    static bindDrawerEvents() {
        const closeBtn = document.getElementById('cart-close-btn');
        const backdrop = document.getElementById('cart-drawer-backdrop');

        if (closeBtn) closeBtn.onclick = () => this.closeDrawer();
        if (backdrop) backdrop.onclick = () => this.closeDrawer();

        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const size = btn.getAttribute('data-size');
                CartService.removeItem(id, size);
            };
        });

        document.querySelectorAll('.cart-qty-minus').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const size = btn.getAttribute('data-size');
                const current = CartService.getCart().find(i => i.id === id && i.size === size);
                if (current) {
                    CartService.updateQuantity(id, size, current.quantity - 1);
                }
            };
        });

        document.querySelectorAll('.cart-qty-plus').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const size = btn.getAttribute('data-size');
                const current = CartService.getCart().find(i => i.id === id && i.size === size);
                if (current) {
                    CartService.updateQuantity(id, size, current.quantity + 1);
                }
            };
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                alert('Redirecionando para o Checkout Seguro Hot Chili...');
            };
        }
    }
}
