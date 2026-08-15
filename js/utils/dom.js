/**
 * dom.js
 * Utilitários reutilizáveis para manipulação do DOM, controle de abas, filtros e animações.
 */

/**
 * Atalho seguro para document.querySelector
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Atalho seguro para document.querySelectorAll
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {NodeListOf<Element>}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Inicializa animações de entrada por scroll para elementos com classe .fade-lift
 * @param {string} [selector='.fade-lift'] 
 */
export function initScrollAnimations(selector = '.fade-lift') {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/**
 * Rola suavemente até um elemento de destino considerando o deslocamento do cabeçalho fixo.
 * @param {string|Element} target - Seletor CSS ou Elemento DOM.
 * @param {number} [offset=80] - Deslocamento em pixels para compensar header fixo.
 */
export function smoothScrollTo(target, offset = 80) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Gerenciador universal de abas (Tabs).
 * Alterna botões ativos e painéis de conteúdo de forma declarativa.
 * 
 * @param {Object} options
 * @param {NodeList|Array<Element>} options.tabButtons - Lista de botões da aba.
 * @param {NodeList|Array<Element>} options.tabPanels - Lista de painéis de conteúdo correspondentes.
 * @param {string} [options.activeBtnClass] - Classes CSS para o botão ativo.
 * @param {string} [options.inactiveBtnClass] - Classes CSS para botões inativos.
 * @param {Function} [options.onChange] - Callback disparado na troca de aba (recebe index e botão).
 */
export function setupTabs({
    tabButtons,
    tabPanels = [],
    activeBtnClass = 'bg-primary text-on-primary font-semibold shadow-xs border-primary',
    inactiveBtnClass = 'bg-transparent text-on-surface-variant hover:text-on-surface border-outline-variant/30 hover:border-primary/40',
    onChange = null
}) {
    if (!tabButtons || !tabButtons.length) return;

    const buttons = Array.from(tabButtons);
    const panels = Array.from(tabPanels);

    const activateTab = (index) => {
        buttons.forEach((btn, i) => {
            const baseClass = btn.getAttribute('data-base-class') || 'tab-btn px-4 py-1.5 rounded-full font-label-sm text-xs uppercase tracking-wider border transition-all duration-200';
            if (i === index) {
                btn.className = `${baseClass} ${activeBtnClass}`;
            } else {
                btn.className = `${baseClass} ${inactiveBtnClass}`;
            }
        });

        panels.forEach((panel, i) => {
            if (panel) {
                if (i === index) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            }
        });

        if (typeof onChange === 'function') {
            onChange(index, buttons[index], panels[index]);
        }
    };

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(index);
        });
    });

    return {
        activateTab
    };
}

/**
 * Atualiza o estado visual de uma lista de botões/pills de filtro (Painel 2 ou Vitrine).
 * Estilo refinado, discreto e compacto.
 * 
 * @param {NodeList|Array<Element>} buttons - Lista de botões de filtro.
 * @param {string} activeValue - Valor ativo correspondente.
 * @param {string} attrName - Atributo de dados (ex: 'data-filter-sub', 'data-home-filter').
 * @param {Object} [classConfig] - Configuração de classes CSS ativa e inativa.
 */
export function updatePillState(
    buttons,
    activeValue,
    attrName = 'data-filter-sub',
    classConfig = {}
) {
    const activeClass = classConfig.activeClass || 'px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap shadow-xs font-semibold border border-primary transition-all duration-200 flex-shrink-0';
    const inactiveClass = classConfig.inactiveClass || 'px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-sm text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap border border-outline-variant/30 hover:border-primary/40 transition-colors duration-200 flex-shrink-0';

    let foundActive = false;
    buttons.forEach(btn => {
        const val = btn.getAttribute(attrName);
        if (val === activeValue) {
            btn.className = activeClass;
            foundActive = true;
        } else {
            btn.className = inactiveClass;
        }
    });

    // Se nenhum botão específico deu match, ativa o botão 'all' se existir
    if (!foundActive) {
        buttons.forEach(btn => {
            if (btn.getAttribute(attrName) === 'all') {
                btn.className = activeClass;
            }
        });
    }
}

/**
 * Exibe uma mensagem temporária de feedback em um elemento e a oculta após um tempo.
 * @param {Element|string} el - Elemento de feedback ou seletor.
 * @param {string} message - Texto da mensagem.
 * @param {number} [duration=4000] - Tempo em milissegundos para auto-ocultação.
 */
export function showTemporaryFeedback(el, message, duration = 4000) {
    const target = typeof el === 'string' ? document.querySelector(el) : el;
    if (!target) return;

    target.textContent = message;
    target.classList.remove('hidden');

    setTimeout(() => {
        target.classList.add('hidden');
    }, duration);
}
