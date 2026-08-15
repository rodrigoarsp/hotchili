/**
 * CartDrawer.js
 * Componente visual da gaveta lateral da sacola de compras (Totalmente Responsivo).
 */
import { CartService } from '../services/CartService.js';
import { formatCurrency } from '../utils/formatters.js';

export class CartDrawer {
    static render() {
        const items = CartService.getCart();
        const total = CartService.getTotal();

        const itemsHtml = items.length === 0 ? `
            <div class="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant px-4">
                <div class="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-3xl text-outline">shopping_bag</span>
                </div>
                <p class="font-display-lg text-xl font-bold text-on-surface mb-2">Sua sacola está vazia</p>
                <p class="font-body-md text-sm text-on-surface-variant/80 mb-6 max-w-xs">Explore nossas coleções exclusivas e adicione suas peças favoritas.</p>
                <a href="moda-banho.html" class="px-8 py-3.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest rounded-sm hover:bg-primary-container transition-colors shadow-md">Ver Moda Banho</a>
            </div>
        ` : items.map(item => `
            <div class="flex items-center gap-3 sm:gap-4 py-4 border-b border-outline-variant/30" data-item-id="${item.id}" data-item-size="${item.size}">
                <img src="${item.image}" alt="${item.name}" class="w-16 sm:w-20 h-24 sm:h-28 object-cover rounded-sm bg-surface-container-low flex-shrink-0" />
                <div class="flex-grow min-w-0 pr-2">
                    <h4 class="font-display-lg text-sm sm:text-base text-on-surface font-bold truncate">${item.name}</h4>
                    <p class="font-body-md text-xs text-on-surface-variant mt-0.5">${item.color} | Tam: <span class="font-bold text-on-surface">${item.size}</span></p>
                    <span class="font-body-lg text-sm text-primary font-bold mt-1.5 inline-block">${item.formattedPrice || formatCurrency(item.price)}</span>
                </div>
                <div class="flex flex-col items-end gap-3 flex-shrink-0">
                    <button class="cart-remove-btn w-8 h-8 flex items-center justify-center text-on-surface-variant/70 hover:text-error transition-colors rounded-full active:bg-surface-variant" data-id="${item.id}" data-size="${item.size}" aria-label="Remover item">
                        <span class="material-symbols-outlined text-lg">delete_outline</span>
                    </button>
                    <div class="flex items-center border border-outline-variant/50 rounded bg-surface">
                        <button class="cart-qty-minus w-7 h-7 flex items-center justify-center text-sm font-bold text-on-surface-variant hover:bg-surface-variant active:bg-surface-variant/80" data-id="${item.id}" data-size="${item.size}" aria-label="Diminuir quantidade">-</button>
                        <span class="px-2 text-xs font-bold text-on-surface min-w-[20px] text-center">${item.quantity}</span>
                        <button class="cart-qty-plus w-7 h-7 flex items-center justify-center text-sm font-bold text-on-surface-variant hover:bg-surface-variant active:bg-surface-variant/80" data-id="${item.id}" data-size="${item.size}" aria-label="Aumentar quantidade">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div id="cart-drawer-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 opacity-0 pointer-events-none invisible transition-all duration-300"></div>
            
            <aside id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-full sm:max-w-md bg-surface shadow-2xl z-50 transform translate-x-full invisible pointer-events-none transition-all duration-400 ease-out-quint flex flex-col" aria-label="Sacola de Compras">
                <div class="flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 border-b border-outline-variant/30 bg-surface">
                    <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                        <h3 class="font-display-lg text-lg sm:text-xl tracking-wider text-on-surface font-bold uppercase">Sua Sacola</h3>
                    </div>
                    <button id="cart-close-btn" class="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full active:bg-surface-variant" aria-label="Fechar Sacola">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div class="flex-grow overflow-y-auto px-5 sm:px-6 py-2 hide-scrollbar">
                    ${itemsHtml}
                </div>

                ${items.length > 0 ? `
                <div class="p-5 sm:p-6 border-t border-outline-variant/30 bg-surface-container-low space-y-4 safe-bottom-padding">
                    <div class="flex justify-between items-center font-body-lg text-base">
                        <span class="text-on-surface-variant font-medium">Subtotal</span>
                        <span class="font-bold text-primary text-xl">${formatCurrency(total)}</span>
                    </div>
                    <p class="text-xs text-emerald-800 font-medium text-center">Frete calculado na etapa de pagamento</p>
                    <a href="checkout.html" id="checkout-btn" class="w-full py-4 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-primary-container transition-colors shadow-lg text-center block active:scale-[0.99]">
                        Finalizar Compra
                    </a>
                </div>
                ` : ''}
            </aside>
        `;
    }
}
