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
    2: 'Bimestral',
    3: 'Trimestral',
};

export const PERIODICIDADE_TO_QTDE = {
    Bimestral: 2,
    Trimestral: 3,
};

export const PERIODO_LABEL = {
    2: 'Bimestre',
    3: 'Trimestre',
};

export const TIPO_AVALIACAO_DISPLAY = {
    PROVA: 'Prova',
    TRABALHO: 'Trabalho',
    ATIVIDADE: 'Atividade',
    RECUPERACAO: 'Recuperação',
};

export const TIPO_AVALIACAO_TO_ENUM = {
    Prova: 'PROVA',
    Trabalho: 'TRABALHO',
    Atividade: 'ATIVIDADE',
    'Recuperação': 'RECUPERACAO',
};

/**
 * Returns the mapped display label, falling back to the raw value.
 * @param {Object} map
 * @param {string|number} value
 * @returns {string}
 */
export const displayLabel = (map, value) => map[value] ?? String(value ?? '');
