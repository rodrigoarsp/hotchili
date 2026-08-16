/**
 * formatters.js
 * Utilitários de formatação de valores monetários, cálculos de desconto e dados textuais.
 */

/**
 * Formata um valor numérico no padrão de moeda brasileira (BRL).
 * @param {number|string} value - Valor a ser formatado.
 * @returns {string} Exemplo: "R$ 498,00"
 */
export function formatCurrency(value) {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : Number(value);
    if (isNaN(num)) return 'R$ 0,00';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Calcula e formata o preço com desconto para pagamento via PIX.
 * @param {number|string} value - Valor original.
 * @param {number} discountPct - Percentual de desconto (padrão 5% = 0.05).
 * @returns {string} Exemplo: "R$ 473,10"
 */
export function formatPixPrice(value, discountPct = 0.05) {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : Number(value);
    if (isNaN(num)) return 'R$ 0,00';
    const discounted = num * (1 - discountPct);
    return formatCurrency(discounted);
}

/**
 * Retorna o texto formatado para parcelamento sem juros.
 * @param {number|string} value - Valor total.
 * @param {number} maxInstallments - Número máximo de parcelas (padrão: 6).
 * @returns {string} Exemplo: "em até 6x de R$ 83,00 sem juros"
 */
export function formatInstallments(value, maxInstallments = 6) {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : Number(value);
    if (isNaN(num) || maxInstallments <= 1) return 'à vista';
    const installmentValue = num / maxInstallments;
    return `em até ${maxInstallments}x de ${formatCurrency(installmentValue)} sem juros`;
}

/**
 * Sanitiza e formata uma string como CEP brasileiro (00000-000).
 * @param {string} cep
 * @returns {string}
 */
export function formatCep(cep) {
    if (!cep) return '';
    const clean = cep.replace(/\D/g, '').slice(0, 8);
    if (clean.length > 5) {
        return `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    return clean;
}

/**
 * Sanitiza e formata telefone brasileiro (11) 99999-9999.
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '').slice(0, 11);
    if (clean.length > 10) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    } else if (clean.length > 6) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    } else if (clean.length > 2) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    }
    return clean;
}

/**
 * Normaliza e resolve caminhos de imagem para garantir exibição correta em qualquer página ou subpasta (/admin/)
 * @param {string} url
 * @returns {string}
 */
export function formatImageUrl(url) {
    if (!url || typeof url !== 'string') {
        return 'https://lh3.googleusercontent.com/aida/AP1WRLv0AnpwWM9lFcATKKXnjeEEIDVm63QfdCjpG49SQN4FljTrNYzhaPJVK1LEPnEhhjIaNlHs2lKWfiITcu0SUaa8Qoq6wYzJK2kT6QYFoAqhaBcrOy33fDlP5byn3t1i7m0XEGUtA-y93dEN86-pEVxdBCZBftW7_J4E7l-MorlT-bYzoaqn6zWJFXYjQ6PPZcFMsx471SMUK6dFMIQYMzbA3lClJ6B837gKMn7E5_DFcGKV7d2nq9YhJw';
    }

    const trimmed = url.trim();

    // Se for URL externa completa ou Data URL base64, retorna direto
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
        return trimmed;
    }

    // Se começar com uploads/ ou /uploads/, converter para caminho raiz absoluto ou URL completa
    if (trimmed.startsWith('uploads/')) {
        return '/' + trimmed;
    }

    if (trimmed.startsWith('/uploads/')) {
        return trimmed;
    }

    return trimmed;
}

