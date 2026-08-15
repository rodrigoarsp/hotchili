/**
 * NavigationContext.js
 * Contexto responsável pelo estado do menu mobile/tablet e comportamento da navegação.
 */
export class NavigationContext {
    static #menuTimeout = null;

    static init() {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const backdrop = document.getElementById('mobile-menu-backdrop');
        const navLinks = document.querySelectorAll('.mobile-nav-link');

        const openMenu = () => {
            if (this.#menuTimeout) clearTimeout(this.#menuTimeout);
            
            if (backdrop) {
                backdrop.classList.remove('invisible', 'pointer-events-none');
                void backdrop.offsetWidth;
                backdrop.classList.remove('opacity-0');
            }

            if (mobileMenu) {
                mobileMenu.classList.remove('invisible', 'pointer-events-none');
                void mobileMenu.offsetWidth;
                mobileMenu.classList.remove('-translate-x-full');
            }

            document.body.classList.add('overflow-hidden');
        };

        const closeMenu = () => {
            if (backdrop) {
                backdrop.classList.add('opacity-0', 'pointer-events-none');
            }

            if (mobileMenu) {
                mobileMenu.classList.add('-translate-x-full', 'pointer-events-none');
            }

            document.body.classList.remove('overflow-hidden');

            this.#menuTimeout = setTimeout(() => {
                if (mobileMenu) mobileMenu.classList.add('invisible');
                if (backdrop) backdrop.classList.add('invisible');
                this.#menuTimeout = null;
            }, 400);
        };

        if (mobileBtn) {
            mobileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openMenu();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeMenu();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                closeMenu();
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }
}
