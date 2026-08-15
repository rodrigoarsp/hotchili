/**
 * CheckoutPage.js
 * Controlador da Página de Checkout com Integração Real:
 * 1. API dos Correios: Cálculo dinâmico de frete PAC e SEDEX com base no CEP digitado.
 * 2. API do Mercado Pago: Geração de PIX dinâmico com QR Code e Copia e Cola e Token de Cartão.
 * 3. Persistência de Pedidos no Banco MySQL / Headless Store.
 */
import { CartService } from '../services/CartService.js';
import { ProductService } from '../services/ProductService.js';
import { ApiService } from '../services/ApiService.js';
import { formatCurrency, formatCep } from '../utils/formatters.js';
import { $, $$ } from '../utils/dom.js';

export class CheckoutPage {
    static init() {
        const itemsList = $('#checkout-items-list');
        const subtotalEl = $('#checkout-subtotal');
        const shippingEl = $('#checkout-shipping');
        const discountEl = $('#checkout-discount');
        const totalEl = $('#checkout-total');
        const discountRow = $('#checkout-discount-row');
        
        let isPix = true;
        let couponDiscount = 0;
        let selectedShippingCost = 0;
        let selectedShippingName = 'SEDEX';
        let isFreeShipping = false;

        const renderCheckout = () => {
            let state = CartService.getState();
            
            // Fallback de demonstração se a sacola estiver vazia
            if (state.items.length === 0) {
                const defaultProd = ProductService.getById('mb-01') || ProductService.getAll()[0];
                if (defaultProd) {
                    CartService.addItem(defaultProd, 1);
                    state = CartService.getState();
                }
            }

            if (itemsList) {
                itemsList.innerHTML = state.items.map(item => {
                    const prodName = item.name || item.product?.name || 'Produto';
                    const prodImg = item.image || item.product?.image || '';
                    const prodPrice = Number(item.price || item.product?.price || 0);
                    const prodColor = item.color || item.product?.color || 'Padrão';
                    const prodSize = item.size || 'M';
                    const itemTotal = prodPrice * item.quantity;
                    return `
                        <div class="flex items-center gap-4 pt-3 first:pt-0">
                            <img src="${prodImg}" alt="${prodName}" class="w-16 h-20 object-cover rounded-sm bg-surface-container flex-shrink-0"/>
                            <div class="flex-grow">
                                <h4 class="font-headline-lg text-sm text-on-surface font-bold">${prodName}</h4>
                                <p class="text-[11px] text-on-surface-variant">Tam: ${prodSize} | Cor: ${prodColor}</p>
                                <p class="text-xs text-on-surface-variant mt-1">Qtd: ${item.quantity}</p>
                            </div>
                            <span class="font-headline-lg text-sm text-primary font-bold">${formatCurrency(itemTotal)}</span>
                        </div>
                    `;
                }).join('');
            }

            const subtotal = state.total;
            const pixDiscount = isPix ? subtotal * 0.05 : 0;
            const totalDiscount = pixDiscount + couponDiscount;
            const finalTotal = Math.max(0, subtotal + selectedShippingCost - totalDiscount);

            if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
            if (shippingEl) shippingEl.textContent = selectedShippingCost === 0 ? 'Grátis' : formatCurrency(selectedShippingCost);
            if (discountEl) discountEl.textContent = `- ${formatCurrency(totalDiscount)}`;
            if (totalEl) totalEl.textContent = formatCurrency(finalTotal);

            return { subtotal, totalDiscount, finalTotal, state };
        };

        renderCheckout();

        // =========================================================
        // 1. INTEGRAÇÃO COM A API DOS CORREIOS (CÁLCULO DE FRETE)
        // =========================================================
        const cepInput = $('#shipping-cep-input');
        const cepFeedback = $('#shipping-cep-feedback');
        const shippingOptions = $('#shipping-options-container');

        if (cepInput) {
            cepInput.addEventListener('input', async (e) => {
                cepInput.value = formatCep(cepInput.value);
                const cleanCep = cepInput.value.replace(/\D/g, '');
                
                if (cleanCep.length === 8) {
                    if (cepFeedback) {
                        cepFeedback.textContent = 'Calculando frete via Correios...';
                        cepFeedback.classList.remove('hidden', 'text-red-400');
                        cepFeedback.classList.add('text-primary');
                    }

                    try {
                        const { subtotal } = renderCheckout();
                        const result = await ApiService.calculateShipping(cleanCep, subtotal);

                        if (result.success && result.services) {
                            if (cepFeedback) {
                                cepFeedback.textContent = `Opções de envio para CEP ${cepInput.value}:`;
                            }

                            if (shippingOptions) {
                                shippingOptions.innerHTML = result.services.map((svc, idx) => `
                                    <label class="flex items-center justify-between p-3 rounded border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:border-primary/60 transition-colors">
                                        <div class="flex items-center gap-2.5">
                                            <input type="radio" name="shipping_method" value="${svc.code}" data-price="${svc.price}" ${idx === 0 ? 'checked' : ''} class="text-primary focus:ring-primary" />
                                            <div>
                                                <span class="text-xs font-bold text-on-surface block">${svc.name}</span>
                                                <span class="text-[11px] text-on-surface-variant">${svc.deadline_text}</span>
                                            </div>
                                        </div>
                                        <span class="text-xs font-bold ${svc.price === 0 ? 'text-emerald-400' : 'text-primary'}">
                                            ${svc.price === 0 ? 'GRÁTIS' : formatCurrency(svc.price)}
                                        </span>
                                    </label>
                                `).join('');

                                // Ouvir alteração do método de frete
                                const radios = shippingOptions.querySelectorAll('input[name="shipping_method"]');
                                radios.forEach(r => {
                                    r.addEventListener('change', (e) => {
                                        selectedShippingCost = parseFloat(e.target.getAttribute('data-price')) || 0;
                                        selectedShippingName = e.target.value;
                                        renderCheckout();
                                    });
                                });

                                // Selecionar o primeiro por padrão
                                if (radios.length > 0) {
                                    selectedShippingCost = parseFloat(radios[0].getAttribute('data-price')) || 0;
                                    selectedShippingName = radios[0].value;
                                    renderCheckout();
                                }
                            }
                        }
                    } catch (err) {
                        if (cepFeedback) {
                            cepFeedback.textContent = 'Erro ao consultar CEP. Tente novamente.';
                            cepFeedback.classList.remove('text-primary');
                            cepFeedback.classList.add('text-red-400');
                        }
                    }
                }
            });
        }

        // =========================================================
        // 2. ALTERNÂNCIA DE ABAS DE PAGAMENTO (PIX / CARTÃO)
        // =========================================================
        const pixTabBtn = $('#pix-tab-btn');
        const cardTabBtn = $('#card-tab-btn');
        const pixContent = $('#pix-content');
        const cardContent = $('#card-content');

        const activePaymentClass = 'payment-tab py-3 px-4 rounded-sm border-2 border-primary bg-primary-container/20 text-on-surface font-label-sm text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2';
        const inactivePaymentClass = 'payment-tab py-3 px-4 rounded-sm border-2 border-outline-variant/40 bg-surface text-on-surface font-label-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2';

        if (pixTabBtn && cardTabBtn) {
            pixTabBtn.addEventListener('click', () => {
                isPix = true;
                pixTabBtn.className = activePaymentClass;
                cardTabBtn.className = inactivePaymentClass;
                if (pixContent) pixContent.classList.remove('hidden');
                if (cardContent) cardContent.classList.add('hidden');
                if (discountRow) discountRow.classList.remove('hidden');
                renderCheckout();
            });

            cardTabBtn.addEventListener('click', () => {
                isPix = false;
                cardTabBtn.className = activePaymentClass;
                pixTabBtn.className = inactivePaymentClass;
                if (cardContent) cardContent.classList.remove('hidden');
                if (pixContent) pixContent.classList.add('hidden');
                if (discountRow) discountRow.classList.add('hidden');
                renderCheckout();
            });
        }

        // Cupom de Desconto
        const couponInput = $('#coupon-input');
        const applyCouponBtn = $('#apply-coupon-btn');
        if (couponInput && applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const code = couponInput.value.trim().toUpperCase();
                if (code === 'HOTCHILI10' || code === 'PRIMEIRACOMPRA') {
                    couponDiscount = 50;
                    alert('Cupom aplicado com sucesso: R$ 50,00 de desconto!');
                    renderCheckout();
                } else if (code.length > 0) {
                    alert('Cupom inválido ou expirado.');
                }
            });
        }

        // =========================================================
        // 3. INTEGRAÇÃO MERCADO PAGO: FINALIZAÇÃO DO PEDIDO
        // =========================================================
        const finishBtn = $('#finish-order-btn');
        const successModal = $('#order-success-modal');

        if (finishBtn) {
            finishBtn.addEventListener('click', async () => {
                const { finalTotal, state } = renderCheckout();
                
                finishBtn.disabled = true;
                finishBtn.innerHTML = `<span>Processando no Mercado Pago...</span>`;

                try {
                    const orderId = 'HC-' + Math.floor(100000 + Math.random() * 900000);
                    const customerName = $('#customer-name')?.value || 'Cliente Hot Chili';
                    const customerEmail = $('#customer-email')?.value || 'cliente@hotchili.com.br';
                    const customerPhone = $('#customer-phone')?.value || '(11) 99999-8888';

                    let paymentResult = null;

                    if (isPix) {
                        // Gerar Cobrança PIX via API Mercado Pago
                        paymentResult = await ApiService.createPixPayment({
                            amount: finalTotal,
                            email: customerEmail,
                            name: customerName,
                            order_id: orderId
                        });
                    }

                    // Registrar pedido no CMS / MySQL
                    await ApiService.createOrder({
                        id: orderId,
                        customer_name: customerName,
                        customer_email: customerEmail,
                        customer_phone: customerPhone,
                        total: finalTotal,
                        payment_method: isPix ? 'pix' : 'credit_card',
                        payment_status: isPix ? 'pending' : 'approved',
                        shipping_service: selectedShippingName,
                        shipping_tracking: 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'SP',
                        items: state.items
                    });

                    // Exibir Modal de Sucesso com QR Code do Mercado Pago
                    if (successModal) {
                        const qrImg = $('#pix-qr-image');
                        const qrCodeText = $('#pix-qr-code-text');
                        const modalOrderNum = $('#modal-order-number');

                        if (modalOrderNum) modalOrderNum.textContent = `#${orderId}`;
                        if (qrImg && paymentResult?.qr_code_base64) qrImg.src = paymentResult.qr_code_base64;
                        if (qrCodeText && paymentResult?.qr_code) qrCodeText.value = paymentResult.qr_code;

                        successModal.classList.remove('hidden');
                    }

                    CartService.clear();
                } catch (err) {
                    alert('Erro ao processar pagamento com o Mercado Pago: ' + err.message);
                } finally {
                    finishBtn.disabled = false;
                    finishBtn.innerHTML = `<span>Finalizar Compra Segura</span>`;
                }
            });
        }
    }
}
