/**
 * CategoryService.js
 * Serviço de dados para estrutura de categorias e navegação.
 */
export class CategoryService {
    static getCategories() {
        return [
            {
                id: 'moda-banho',
                name: 'Moda Banho',
                href: 'moda-banho.html',
                subcategories: [
                    { name: 'Biquínis', href: 'moda-banho.html?sub=biquinis' },
                    { name: 'Maiôs', href: 'moda-banho.html?sub=maios' },
                    { name: 'Sungas Adulto', href: 'moda-banho.html?sub=sungas' },
                    { name: 'Ver tudo de banho', href: 'moda-banho.html?sub=all', highlight: true }
                ]
            },
            {
                id: 'resort-sunset',
                name: 'Resort & Sunset',
                href: 'resort-sunset.html',
                subcategories: [
                    { name: 'Saídas de Crochê', href: 'resort-sunset.html?sub=croche' },
                    { name: 'Calças (Tricô e Praia)', href: 'resort-sunset.html?sub=calcas' },
                    { name: 'Saias e Shorts', href: 'resort-sunset.html?sub=saias-shorts' },
                    { name: 'Vestidos', href: 'resort-sunset.html?sub=vestidos' },
                    { name: 'Ver tudo de resort', href: 'resort-sunset.html?sub=all', highlight: true }
                ]
            },
            {
                id: 'kids',
                name: 'Kids',
                href: 'kids.html',
                subcategories: [
                    { name: 'Biquínis e Maiôs Infantis', href: 'kids.html?sub=biquinis-maios' },
                    { name: 'Sungas Infantis', href: 'kids.html?sub=sungas-infantis' },
                    { name: 'Ver tudo infantil', href: 'kids.html?sub=all', highlight: true }
                ]
            },
            {
                id: 'acessorios',
                name: 'Acessórios',
                href: 'acessorios.html',
                subcategories: [
                    { name: 'Bolsas, Chapéus e Cangas', href: 'acessorios.html?sub=bolsas-chapeus' },
                    { name: 'Demais Acessórios', href: 'acessorios.html?sub=demais' },
                    { name: 'Ver todos acessórios', href: 'acessorios.html?sub=all', highlight: true }
                ]
            },
            {
                id: 'protecao-solar',
                name: 'Proteção Solar',
                href: 'protecao-solar.html',
                subcategories: [
                    { name: 'Blusas de Proteção (Adulto e Infantil)', href: 'protecao-solar.html?sub=blusas' },
                    { name: 'Ver toda proteção UV', href: 'protecao-solar.html?sub=all', highlight: true }
                ]
            }
        ];
    }
}
