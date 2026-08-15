/**
 * ProductCard.js
 * Adaptador / fachada para o componente ProductGrid.js garantindo compatibilidade reversa.
 */
import { ProductGrid } from './ProductGrid.js';

export class ProductCard {
    static renderProductGrid(products) {
        return ProductGrid.renderCards(products);
    }

    static renderSingleCard(product) {
        return ProductGrid.renderSingleCard(product);
    }
}
