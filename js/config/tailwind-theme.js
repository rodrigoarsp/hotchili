/**
 * tailwind-theme.js
 * Configuração centralizada do Tailwind CSS para a Hot Chili Luxury Beachwear.
 * Compartilhada por todas as páginas HTML para garantir consistência e evitar duplicação.
 */
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    'primary': '#7b5800',
                    'on-primary': '#ffffff',
                    'primary-container': '#c59940',
                    'on-primary-container': '#493300',
                    'primary-fixed': '#ffdea5',
                    'primary-fixed-dim': '#efbf62',
                    'on-primary-fixed': '#271900',
                    'on-primary-fixed-variant': '#5d4200',
                    'inverse-primary': '#efbf62',
                    'secondary': '#5f5e5e',
                    'on-secondary': '#ffffff',
                    'secondary-container': '#e5e2e1',
                    'on-secondary-container': '#656464',
                    'surface': '#fff8f3',
                    'on-surface': '#201b13',
                    'surface-variant': '#ece1d4',
                    'on-surface-variant': '#4e4637',
                    'surface-dim': '#e4d8cc',
                    'surface-bright': '#fff8f3',
                    'surface-container-lowest': '#ffffff',
                    'surface-container-low': '#fef2e5',
                    'surface-container': '#f8ecdf',
                    'surface-container-high': '#f2e6da',
                    'surface-container-highest': '#ece1d4',
                    'outline': '#807665',
                    'outline-variant': '#d2c5b2'
                },
                borderRadius: {
                    'DEFAULT': '0.125rem',
                    'lg': '0.25rem',
                    'xl': '0.5rem',
                    'full': '0.75rem'
                },
                spacing: {
                    'unit': '4px',
                    'gutter': '16px',
                    'margin-mobile': '20px',
                    'margin-desktop': '80px',
                    'section-gap': '64px'
                },
                fontFamily: {
                    'display-lg': ['Playfair Display', 'Cinzel', 'serif'],
                    'headline-lg': ['Playfair Display', 'serif'],
                    'title-md': ['Hanken Grotesk', 'sans-serif'],
                    'body-lg': ['Hanken Grotesk', 'sans-serif'],
                    'body-md': ['Hanken Grotesk', 'sans-serif'],
                    'label-sm': ['Hanken Grotesk', 'sans-serif']
                }
            }
        }
    };
}
