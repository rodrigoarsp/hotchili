import { formatCurrency } from '../utils/formatters.js';

export class CartService {
    static STORAGE_KEY = 'hotchili_cart_state';
    static #listeners = [];

    static getCart() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Erro ao ler carrinho do localStorage', e);
            return [];
        }
    }

    static saveCart(items) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            this.#notifyListeners();
        } catch (e) {
            console.error('Erro ao salvar carrinho', e);
        }
    }

    static getState() {
        return {
            items: this.getCart(),
            count: this.getItemCount(),
            total: this.getTotal()
        };
    }

    static clear() {
        this.saveCart([]);
    }

    static addItem(product, quantity = 1, size = 'M') {
        const items = this.getCart();
        const selectedSize = product.size || size || 'M';
        const selectedColor = product.color || 'Padrão';
        const priceNum = Number(product.price) || 0;
        const existingIndex = items.findIndex(i => i.id === product.id && i.size === selectedSize);

        if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                price: priceNum,
                formattedPrice: product.formattedPrice || formatCurrency(priceNum),
                color: selectedColor,
                image: product.image,
                quantity: quantity,
                size: selectedSize
            });
        }
        this.saveCart(items);
    }

    static removeItem(id, size) {
        const items = this.getCart().filter(i => !(i.id === id && i.size === size));
        this.saveCart(items);
    }

    static updateQuantity(id, size, quantity) {
        if (quantity <= 0) {
            this.removeItem(id, size);
            return;
        }
        const items = this.getCart();
        const item = items.find(i => i.id === id && i.size === size);
        if (item) {
            item.quantity = quantity;
            this.saveCart(items);
        }
    }

    static getItemCount() {
        const items = this.getCart();
        return items.reduce((acc, item) => acc + item.quantity, 0);
    }

    static getTotal() {
        const items = this.getCart();
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    static subscribe(callback) {
        this.#listeners.push(callback);
    }

    static #notifyListeners() {
        const state = {
            items: this.getCart(),
            count: this.getItemCount(),
            total: this.getTotal()
        };
        this.#listeners.forEach(cb => cb(state));
    }
}
