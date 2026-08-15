/**
 * ProductService.js
 * Serviço de dados para consulta e filtragem do catálogo de produtos Hot Chili.
 */
export class ProductService {
    static #products = [
        // Moda Banho
        {
            id: 'mb-01',
            name: 'Biquíni Ouro Solar',
            category: 'moda-banho',
            subcategory: 'biquinis',
            price: 498.00,
            formattedPrice: 'R$ 498',
            color: 'Textured Gold',
            image: 'https://lh3.googleusercontent.com/aida/AP1WRLvLdFDjrN1Ch0I0sETtUo3lAAJy0Qi9wmyvtcvNvs8PwcKuUvg1Rw8AlDcWc1nhAujPPjHsbZiz7DOmkPkarF0XNrBK9Lg5ULwGeyo_rRgsm0ZrWoNReySdGKdiz-UtMdUzWvBXAp7Oz5_73v-sCIa2TkyNaI3yYCG8yUylTG1tjPBu4A7r_A2a_R_9hzVZojcrilI_mizn3eNpgZtgcT7l019ZRJuWipAAz3-a6--k-BKflAPQq-gbeg4',
            badge: 'Bestseller',
            description: 'Biquíni com detalhes metálicos banhados a ouro e textura exclusiva Sandswept.'
        },
        {
            id: 'mb-02',
            name: 'Maiô Esculpido Chili',
            category: 'moda-banho',
            subcategory: 'maios',
            price: 680.00,
            formattedPrice: 'R$ 680',
            color: 'Obsidian Noir',
            image: 'https://lh3.googleusercontent.com/aida/AP1WRLtSY3lqnAzbeCAJDDEdMvuRrcR_NyyY-mJtOk2aoLZcvQM9jNTr1ruCU23r4AlUXyhqtSbSoXRXKGO9fRRoZ2TiTOvsOwG_jjHpiB1miefQW6mpmrSi-DiAKAqI0vl0y--yOq_DbA3kWZEkZiTr5zqmfaF4Ahr17JovhS4Kew5ydxwQfic4LpGYQFhLuVdgw_DJTSJHqd5TDkjznfTF2Xw_2tCavXkBIhdPlkYs5LbAhCi8WlWHxo7C-OQ',
            badge: 'Exclusivo',
            description: 'Maiô de alta compressão com recortes anatômicos e decote dramático.'
        },
        {
            id: 'mb-03',
            name: 'Top Cortininha Clássico',
            category: 'moda-banho',
            subcategory: 'biquinis',
            price: 220.00,
            formattedPrice: 'R$ 220',
            color: 'Branco Areia',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SF7Pwx1UV1JS3SUMUfxovEkHwvNTWstgngipcg3VCpjSyHoRyGNUtq7uGzQUEhloavjUVsF04UepRHj0IL5b_kG_R77qdxiwdNdaCsmBBnNnldOIHMaf5wPHLeM1x328ClUtvygmJEdvhakzPxH4VUCjERdgsjqJyqE6-S7rygvt2W2X9HTD_JneZ5SpsbYK3BcjedR57UitWEFr_VPDkYVj2wjVWzPQC5vnuL74I0RqQlf_6RbsUHc4a-_5ua-bjMkXec_twes',
            description: 'Top cortininha clássico com argolas douradas inoxidáveis.'
        },
        {
            id: 'mb-04',
            name: 'Maiô Assimetria',
            category: 'moda-banho',
            subcategory: 'maios',
            price: 550.00,
            formattedPrice: 'R$ 550',
            color: 'Terracota',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RRlPwc-fls01iAbgbfPK1WjN-ZW-4fEEFHjdeHZ63MjkCZ7skhvQUES7S-aTMRZWsmUnqPtbciOgj5kO7YaqjEX7TJXKeCQPchjB6dJwN3AKwCwLS1H5V_3ZqNT1cKOn4-lrxUEFd5LA4_gQiRC7coDkG5DGnzHfcPhdKUiVT8plvz-pwQNwR71IQXk0IIQVxka7yzAstjfjbNnB3RVx2xfOc8nN8L8iBNkLCCSK0MURdGF9BBtmLt0E8G7jP1UjY3xOMZb7TZg',
            description: 'Maiô ombro só com drapeado artesanal e caimento impecável.'
        },
        {
            id: 'mb-05',
            name: 'Sunga Clássica Obsidian',
            category: 'moda-banho',
            subcategory: 'sungas',
            price: 260.00,
            formattedPrice: 'R$ 260',
            color: 'Obsidian Noir',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUI-cpSwPXz8uj-1eGv7qgscB63KOHVRQOvcCktGeK8kt-KNFe-tr1nih9zAW_jJCzlQoVGAZXlPAaAcfU1PDcmf3-SRw02S-g8kOa1OSNgYjs9mdOgx-05CEdXKI01YEf4K2d87Q5fpto8EARgV_iptJbzQ0c9ucyRVq5ibUQbpPUBfnRK9WKUFZ0sIihLrOwSvCy03GWXsskK_JLEDoqTs_YFifDyM-c4udh8J7hDVv0Eqak6cvsg0I9rcndDsKTSUEQqcdlICA',
            badge: 'Bestseller',
            description: 'Sunga masculina com corte anatômico e tecido de secagem rápida com proteção solar.'
        },
        {
            id: 'mb-06',
            name: 'Sunga Slim Golden Sand',
            category: 'moda-banho',
            subcategory: 'sungas',
            price: 290.00,
            formattedPrice: 'R$ 290',
            color: 'Textured Gold',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqbwSvratXEMRlrqqgBtrm62trjIX76RZ9Vrweycnr8-w2vFFD_EQtt4BL67oVkfgcN_CSLE7aDAcYISuNKHPD3z87_6-kiPoqB2ur-HtoDOxGZf44IMoEA-YC4qAXPA8ej5ehiScW3LzQv1jxseOrjWqgVXFUnDdC4BPNoqVf6iMkTOSoEqUdqx3BJ6inL5STGcVGZ3Y0jKfLH-hyYcNbDulB2sf4qsVjGXaxUMF4zqOXOkC-A9DN',
            description: 'Sunga slim com detalhes metálicos laterais banhados a ouro.'
        },

        // Resort & Sunset
        {
            id: 'rs-01',
            name: 'Saída de Crochê Sunset',
            category: 'resort-sunset',
            subcategory: 'croche',
            price: 740.00,
            formattedPrice: 'R$ 740',
            color: 'Cru & Dourado',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeUaUSOrwUFV4FuDJKvx3cKiPtkVatoHk6wuLRn0qYeAaIYOrrXPGUvLFBYaWvfwuTBgh6FdXbvIdy9aRav8Er-aVpsLKaV_3gnJebU9prQoAdatqLugsmwb3P1_CXkZEx4wU4ViYz7qvybxUzazOeM_olRby8MrRAa4jDcH3MNuPkOxdaIGJ9bURDPSJ5SJeU0RAqC13tmHkhH04EMFGGhmfG8bkGcySpMvotLCd7T-RjdnIf28E2te7u_5KpOEj5yG1AB3K_YGI',
            badge: 'Artesanal',
            description: 'Saída longa em crochê feito à mão com fios de seda e algodão egípcio.'
        },
        {
            id: 'rs-02',
            name: 'Calça Pantalona Tricô',
            category: 'resort-sunset',
            subcategory: 'calcas',
            price: 620.00,
            formattedPrice: 'R$ 620',
            color: 'Sand Beige',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkm7-8Cby4ttDoSyKXnUq4EDqm4e4_STQVxzJwYeaVGBEhIqYUGqSedZrW-f3UmuKECihgCKna4GANZ-KD8aULUbN9FYm94NXWBOQwmgO8n5L3L0WTG-i-ErgnsN2-zqTDytEoRCKl7_IWUTiyfLkZOVSMVc5jhfb2-85sSXEw4xqtQ6N3LclFxUU9v_12F9lGU4tncGf2DkTTvbJ8q04xymVoqcmrCDtLG10HboifhbewYJB_czdoeIj6iojx_5x5iaWUlnEf-cM',
            description: 'Calça pantalona leve com transparência sutil e cós elástico.'
        },
        {
            id: 'rs-03',
            name: 'Vestido de Linho Riviera',
            category: 'resort-sunset',
            subcategory: 'vestidos',
            price: 1250.00,
            formattedPrice: 'R$ 1.250',
            color: 'Sand Beige',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoLOD4Ye861N1PWgijPwj09tSkoJNJZ__pxHUU7rikTxt3xPq7amw9opNOMab9y-9wqjx8M0ji7nxyQnFcseeVf91qAe9pqv4cKTiNTwS90fEURtceHUZ-g0M9vzgomie7CzzAKY6yhsMiP8vnEs7eT5LMvwH2vSFqsEHBPaEXtlMw2TU_qWnP-mt2ZBcZdxqXwBUw24fvLQt8jJX71Ahy9MNltJnpAuMd36Ci481G1mGMZOmOfjYvUv8YEWumanIBvOc4ew6kX5c',
            badge: 'Luxo',
            description: 'Vestido longo em linho puro com modelagem fluida e acabamentos nobres.'
        },
        {
            id: 'rs-04',
            name: 'Shorts Alfaiataria Praia',
            category: 'resort-sunset',
            subcategory: 'saias-shorts',
            price: 480.00,
            formattedPrice: 'R$ 480',
            color: 'Branco Areia',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKpjA4CDhlAP1iZr7ckbc7dXvjgeuplapDsJp2Uv-qHJFNxP5y1QxalI-ii-LqzRNB-WG-4OYCq0DP7xIp5IGclKOv8maRfbFtCkWeP0Pg_kglAY5eO1vYeH2oJ0SKvW00JZC5nmE1NFyu0yklLLiFLT2LM3JHHDJNP6aKxKr0oHwllWIHOqliTxJvMhpZOpgXz40afhkZsUbES8GPqyz2dRQsLn40j_4AVF70oBjRd_r_cdtNVdo5wmQ0V2XWp01mVtJbLNmq5wk',
            description: 'Shorts alfaiataria em linho com corte estruturado.'
        },

        // Kids
        {
            id: 'kd-01',
            name: 'Biquíni Infantil Estampa Coral',
            category: 'kids',
            subcategory: 'biquinis-maios',
            price: 240.00,
            formattedPrice: 'R$ 240',
            color: 'Coral Sun',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RRlPwc-fls01iAbgbfPK1WjN-ZW-4fEEFHjdeHZ63MjkCZ7skhvQUES7S-aTMRZWsmUnqPtbciOgj5kO7YaqjEX7TJXKeCQPchjB6dJwN3AKwCwLS1H5V_3ZqNT1cKOn4-lrxUEFd5LA4_gQiRC7coDkG5DGnzHfcPhdKUiVT8plvz-pwQNwR71IQXk0IIQVxka7yzAstjfjbNnB3RVx2xfOc8nN8L8iBNkLCCSK0MURdGF9BBtmLt0E8G7jP1UjY3xOMZb7TZg',
            badge: 'UV50+',
            description: 'Conjunto infantil com proteção UV50+ e babados delicados.'
        },
        {
            id: 'kd-02',
            name: 'Maiô Infantil UV50+ Palm',
            category: 'kids',
            subcategory: 'biquinis-maios',
            price: 289.00,
            formattedPrice: 'R$ 289',
            color: 'Verde Palm',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6qpZ1gn8HwG7FJ8SKBg6e8yRJVfVSWGAPio-eWS5uwG0qv8qbkVVCtvYvgc60tbHSHyytL1byO1qHmz-birwnovKwtwYwaVH0CX2QlOMVQ8pXoJUQIMg69n6p0qg-hFt3pg18lzf4anDyt0Bk5fDTqfxrZ2lzoP0HlgvJI4HGPBZuWKk8J91TUirYn8C1kKpJJtC6UkPa-6ogRW1om0Y1wJY8QqUP9tmwEwbzZQirkoOeaVGxxH8BKZ1aBRWpDYDHUbGxFWuYoWM',
            badge: 'UV50+',
            description: 'Maiô infantil com estampa de palmeiras e proteção solar máxima.'
        },
        {
            id: 'kd-03',
            name: 'Sunga Infantil Tropical',
            category: 'kids',
            subcategory: 'sungas-infantis',
            price: 189.00,
            formattedPrice: 'R$ 189',
            color: 'Sunset Tropical',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUI-cpSwPXz8uj-1eGv7qgscB63KOHVRQOvcCktGeK8kt-KNFe-tr1nih9zAW_jJCzlQoVGAZXlPAaAcfU1PDcmf3-SRw02S-g8kOa1OSNgYjs9mdOgx-05CEdXKI01YEf4K2d87Q5fpto8EARgV_iptJbzQ0c9ucyRVq5ibUQbpPUBfnRK9WKUFZ0sIihLrOwSvCy03GWXsskK_JLEDoqTs_YFifDyM-c4udh8J7hDVv0Eqak6cvsg0I9rcndDsKTSUEQqcdlICA',
            badge: 'UV50+',
            description: 'Sunga infantil confortável com ajuste perfeito e secagem rápida.'
        },
        {
            id: 'kd-04',
            name: 'Conjunto Proteção Infantil',
            category: 'kids',
            subcategory: 'sungas-infantis',
            price: 329.00,
            formattedPrice: 'R$ 329',
            color: 'Sand Beige',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm-9YbUBjlXEG7NodgcFlxNNNv6Qy66o6LxaX5_LHKAeD39fPiSjEhw84fNC8d7etrqeRyJ7WBHBSOk256Ap6jaiT30elfCCSc8FGF7pPW5rHqHN4ls37-I-HHA0s61h5clQHdfRSxPyjxngdr3Bi0uZ1hQ48Op8-QYqrfFQVoV1IBQKjYPHXqnFjwrgHL3q-kSxPwHyyj9z_-7Q4LhtinuSoqki0xluit7m91xPzdrVDBqv6q_1k1U51JA_Uh1avOpOqEgfC5xPg',
            badge: 'UV50+',
            description: 'Conjunto de blusa manga longa e shortinho com fator de proteção total.'
        },

        // Acessórios
        {
            id: 'ac-01',
            name: 'Bolsa de Palha Artesanal',
            category: 'acessorios',
            subcategory: 'bolsas-chapeus',
            price: 430.00,
            formattedPrice: 'R$ 430',
            color: 'Natural Straw',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz3vDNhKdZH60RrLxbACFHs01fIRqL44F1scRmxi4mnVREBuIcfGhPgSxvHMD1LMWVLO7qvICggkqn83KcJJn7TMbCNvNY9KnkA4NonMC2GLSlMAmKHCgrjEJQdSBx01APFUlDuQDzc7kyjx8ampXRMnYSBejmlwmw8H3F_dan7nm1G4TaQMDRVdcVTiTC3R1gV2f7jIERXE_DQ6hoWeg7TRVyaMBMscuOAGHtLYoVuRV6sLIriHuw',
            badge: 'Artesanal',
            description: 'Bolsa maxi de palha trançada com alças em couro legítimo.'
        },
        {
            id: 'ac-02',
            name: 'Canga de Seda Sunset',
            category: 'acessorios',
            subcategory: 'bolsas-chapeus',
            price: 290.00,
            formattedPrice: 'R$ 290',
            color: 'Seda Estampada',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX5IEnakmfF496NMszIFyW576vZ14gfjWQJ6oMnGKLfwfrE9nkcAbft7gJmtdqbqv8dXepg0Sg3Q7md--Nn89xog-YLVtsDVN35tk8zob8yfvAtwuW55P4ZiBip3LBp-HtcI_Gne3QdJ56dGwrJWnO_6wfZGCflZHwTVaUcZgjFBCWx14cogOdj0rftRz_SIkkKLATOq3IG5MN3cjlrR_xKEVncizXbknWch6UJLydechrKcM8jO9sZgW5JlHyFRLhC1EPE-ogyZs',
            description: 'Canga fluida em seda pura com estampa inspirada no pôr do sol.'
        },
        {
            id: 'ac-03',
            name: 'Óculos de Sol Golden Hour',
            category: 'acessorios',
            subcategory: 'demais',
            price: 560.00,
            formattedPrice: 'R$ 560',
            color: 'Tartaruga & Dourado',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-gPwbX8XDJeyj5eFIqxJaJBiN5EJdycmgbUvM_V1VjPvXlWS9Omz7_CYmJ-u_oSfOselNn-A51F2jcMO3SSwinKatKNbYsz3zDihs_kIyeECLtsiaqbTw4-YZLn5R4aA3hpX1_ES31HVkm5Uhcl1viTv1pYbwZbTDKhCqd7ih_WURIuFI5GcHpp40ainGTq2-TKb1LcT8z0lvP7PvPCI3vgIOx6ATF_u_erUiih3JqCk8z1w_E2ZPIF4UkaYSh3VLL6Mop3iKL3Y',
            badge: 'Exclusivo',
            description: 'Óculos de sol oversized com proteção UV400 e armação artesanal.'
        },
        {
            id: 'ac-04',
            name: 'Colar de Búzios Banhado a Ouro',
            category: 'acessorios',
            subcategory: 'demais',
            price: 340.00,
            formattedPrice: 'R$ 340',
            color: 'Ouro 18k',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCml4NSVqrH3qigLK66Kg1Ll23PC-u2UFFeQsnzVB4oi04CnAz9RBUrMl0WgmMxyztsMBRU_Tl3VQT1lC94HszngE6YZUUW6PO3dESqJteyC4ZTFKjSuHkH_803r52TsBSvpVjArec2K3YTj-ET9nsF68rsHvfUyLRkUZvJeSrTxGJXkSLXXYiXjJj0aUgnlefmktNSt-iYWwzGKyi446gVnrjTPH5Dv_bQp25EQ1wFPBndnCpigQ2u9JmbruyWpFRGiRrmLjCYess',
            description: 'Choker delicada de búzios naturais banhados a ouro 18k.'
        },

        // Proteção Solar
        {
            id: 'ps-01',
            name: 'Blusa UV50+ Manga Longa',
            category: 'protecao-solar',
            subcategory: 'blusas',
            price: 310.00,
            formattedPrice: 'R$ 310',
            color: 'Branco Perla',
            image: 'https://lh3.googleusercontent.com/aida/AP1WRLtSY3lqnAzbeCAJDDEdMvuRrcR_NyyY-mJtOk2aoLZcvQM9jNTr1ruCU23r4AlUXyhqtSbSoXRXKGO9fRRoZ2TiTOvsOwG_jjHpiB1miefQW6mpmrSi-DiAKAqI0vl0y--yOq_DbA3kWZEkZiTr5zqmfaF4Ahr17JovhS4Kew5ydxwQfic4LpGYQFhLuVdgw_DJTSJHqd5TDkjznfTF2Xw_2tCavXkBIhdPlkYs5LbAhCi8WlWHxo7C-OQ',
            badge: 'UV50+',
            description: 'Camisa térmica leve com bloqueio de 98% dos raios UVA e UVB.'
        },
        {
            id: 'ps-02',
            name: 'Camisa UV Elegance Terracota',
            category: 'protecao-solar',
            subcategory: 'blusas',
            price: 340.00,
            formattedPrice: 'R$ 340',
            color: 'Terracota Sun',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-RRlPwc-fls01iAbgbfPK1WjN-ZW-4fEEFHjdeHZ63MjkCZ7skhvQUES7S-aTMRZWsmUnqPtbciOgj5kO7YaqjEX7TJXKeCQPchjB6dJwN3AKwCwLS1H5V_3ZqNT1cKOn4-lrxUEFd5LA4_gQiRC7coDkG5DGnzHfcPhdKUiVT8plvz-pwQNwR71IQXk0IIQVxka7yzAstjfjbNnB3RVx2xfOc8nN8L8iBNkLCCSK0MURdGF9BBtmLt0E8G7jP1UjY3xOMZb7TZg',
            badge: 'UV50+',
            description: 'Camisa de proteção UV com botões em madrepérola e caimento fluido.'
        },
        {
            id: 'ps-03',
            name: 'Visor Solar com Proteção UV',
            category: 'protecao-solar',
            subcategory: 'blusas',
            price: 220.00,
            formattedPrice: 'R$ 220',
            color: 'Sand Beige',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5Dek97EPnLdY6pOYxBoltrVDfsZRNMzZQS8zHZFyCY8VS5FLhdtVKhqbni7zVK7_UY7Uan-Gi4MVeTFzUd4Jebhd0yUYaooNNwRbLc3fjz6oHfgjRU3OjApRw7ahXWKYuG7hLNBb7eLZTXOtLivPeZn1BSIyezHoUk93-m1n3O7IocoLIm8Prh3Cj7YsjRhk-X60_UA8TK1xRryp6zOAvE6aduuI_oIeXmvAzmQbRCzqso1MP2wGO39odzr_uzgCZUMjb5sETNi4',
            badge: 'UV50+',
            description: 'Viseira anatômica ajustável com abas largas com máxima proteção solar.'
        },
        {
            id: 'ps-04',
            name: 'Maiô Proteção Total UV50+',
            category: 'protecao-solar',
            subcategory: 'blusas',
            price: 590.00,
            formattedPrice: 'R$ 590',
            color: 'Obsidian Noir',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkm7-8Cby4ttDoSyKXnUq4EDqm4e4_STQVxzJwYeaVGBEhIqYUGqSedZrW-f3UmuKECihgCKna4GANZ-KD8aULUbN9FYm94NXWBOQwmgO8n5L3L0WTG-i-ErgnsN2-zqTDytEoRCKl7_IWUTiyfLkZOVSMVc5jhfb2-85sSXEw4xqtQ6N3LclFxUU9v_12F9lGU4tncGf2DkTTvbJ8q04xymVoqcmrCDtLG10HboifhbewYJB_czdoeIj6iojx_5x5iaWUlnEf-cM',
            badge: 'UV50+',
            description: 'Maiô manga longa com zíper frontal banhado a ouro e tecido UV50+.'
        }
    ];

    static getAll() {
        try {
            const cmsData = localStorage.getItem('hotchili_cms_products');
            if (cmsData) {
                const parsed = JSON.parse(cmsData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {}
        return this.#products;
    }

    static getByCategory(category) {
        return this.getAll().filter(p => p.category === category || p.category_id === category);
    }

    static getById(id) {
        return this.getAll().find(p => p.id === id);
    }

    static getFeatured() {
        return this.getAll().filter(p => p.featured || p.badge || p.price > 400).slice(0, 8);
    }

    static getBestsellers() {
        return this.getAll().filter(p => p.badge === 'Bestseller' || p.badge === 'Exclusivo' || p.badge === 'Artesanal');
    }
}

