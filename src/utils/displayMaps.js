export const TURNO_DISPLAY = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    INTEGRAL: 'Integral',
};

export const TURNO_TO_ENUM = {
    Matutino: 'MATUTINO',
    Vespertino: 'VESPERTINO',
    Noturno: 'NOTURNO',
    Integral: 'INTEGRAL',
};

export const PERIODICIDADE_DISPLAY = {
    4: 'Bimestral',
    3: 'Trimestral',
};

export const PERIODICIDADE_TO_QTDE = {
    Bimestral: 4,
    Trimestral: 3,
};

export const PERIODO_LABEL = {
    4: 'Bimestre',
    3: 'Trimestre',
};

export const TIPO_AVALIACAO_DISPLAY = {
    PROVA: 'Prova',
    TRABALHO: 'Trabalho',
    ATIVIDADE: 'Atividade',
};

export const TIPO_AVALIACAO_TO_ENUM = {
    Prova: 'PROVA',
    Trabalho: 'TRABALHO',
    Atividade: 'ATIVIDADE',
};

/**
 * Returns the mapped display label, falling back to the raw value.
 * @param {Object} map
 * @param {string|number} value
 * @returns {string}
 */
export const displayLabel = (map, value) => map[value] ?? String(value ?? '');

/**
 * Normalizes a number string for form state (e.g. "7" → "7.0", "7.567" → "7.56").
 * Returns empty string when value is empty.
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export const normalizeNumber = (value) => {
    const text = String(value ?? '').trim().replace(',', '.');
    if (!text) return '';
    const num = parseFloat(text);
    if (Number.isNaN(num)) return '';
    return num.toFixed(2).replace('.', ',');
};

/**
 * Formats a grade value to pt-BR locale with 2 decimal places, or '-' if null.
 * @param {number|null|undefined} n
 * @returns {string}
 */
export const fmtNota = (n) =>
    n != null
        ? Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '-';
