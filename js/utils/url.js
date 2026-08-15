/**
 * url.js
 * Utilitários para leitura e manipulação de parâmetros de URL e identificação de páginas.
 */

/**
 * Obtém o valor de um parâmetro da query string da URL.
 * @param {string} param - Nome do parâmetro (ex: 'sub', 'id').
 * @param {string|null} [defaultValue=null] - Valor padrão caso não exista.
 * @returns {string|null}
 */
export function getQueryParam(param, defaultValue = null) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || defaultValue;
    } catch {
        return defaultValue;
    }
}

/**
 * Define ou remove um parâmetro na query string da URL sem recarregar a página.
 * @param {string} key - Nome do parâmetro.
 * @param {string|null} value - Valor a atribuir (se nulo ou 'all', o parâmetro é removido).
 * @param {boolean} [pushState=true] - Se deve adicionar entrada no histórico de navegação.
 */
export function setQueryParam(key, value, pushState = true) {
    try {
        const url = new URL(window.location.href);
        if (!value || value === 'all') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }

        const stateObj = { [key]: value };
        if (pushState) {
            window.history.pushState(stateObj, '', url.toString());
        } else {
            window.history.replaceState(stateObj, '', url.toString());
        }
    } catch (e) {
        console.warn('Erro ao atualizar URL:', e);
    }
}

/**
 * Identifica o ID canônico da página atual com base no atributo do body ou no pathname.
 * @returns {string}
 */
export function getPageId() {
    const bodyPageId = document.body.getAttribute('data-page-id');
    if (bodyPageId) return bodyPageId;

    const path = window.location.pathname.toLowerCase();
    if (path.includes('moda-banho')) return 'moda-banho';
    if (path.includes('resort-sunset')) return 'resort-sunset';
    if (path.includes('kids')) return 'kids';
    if (path.includes('acessorios')) return 'acessorios';
    if (path.includes('protecao-solar')) return 'protecao-solar';
    if (path.includes('produto')) return 'produto';
    if (path.includes('checkout')) return 'checkout';
    if (path.includes('atendimento')) return 'atendimento';
    if (path.includes('guia-tamanhos')) return 'guia-tamanhos';
    return 'home';
}
