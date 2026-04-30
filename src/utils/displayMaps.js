// ─────────────────────────────────────────────
// Turno
// ─────────────────────────────────────────────
export const TURNO_DISPLAY = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    INTEGRAL: 'Integral',
};

/** 'Matutino' → 'MATUTINO' */
export const TURNO_TO_ENUM = {
    Matutino: 'MATUTINO',
    Vespertino: 'VESPERTINO',
    Noturno: 'NOTURNO',
    Integral: 'INTEGRAL',
};

// ─────────────────────────────────────────────
// Periodicidade  (qtdePeriodos ↔ label)
// ─────────────────────────────────────────────
export const PERIODICIDADE_DISPLAY = {
    4: 'Bimestral',
    3: 'Trimestral',
};

/** 'Bimestral' → 4, 'Trimestral' → 3 */
export const PERIODICIDADE_TO_QTDE = {
    Bimestral: 4,
    Trimestral: 3,
};

// Label do período individual: 4 → 'Bimestre', 3 → 'Trimestre'
export const PERIODO_LABEL = {
    4: 'Bimestre',
    3: 'Trimestre',
};

// ─────────────────────────────────────────────
// Tipo de Avaliação
// ─────────────────────────────────────────────
export const TIPO_AVALIACAO_DISPLAY = {
    PROVA: 'Prova',
    TRABALHO: 'Trabalho',
    ATIVIDADE: 'Atividade',
    RECUPERACAO: 'Recuperação',
};

/** 'Prova' → 'PROVA', etc. */
export const TIPO_AVALIACAO_TO_ENUM = {
    Prova: 'PROVA',
    Trabalho: 'TRABALHO',
    Atividade: 'ATIVIDADE',
    'Recuperação': 'RECUPERACAO',
};

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

/**
 * Returns the mapped display label, falling back to the raw value.
 * @param {Object} map
 * @param {string|number} value
 * @returns {string}
 */
export const displayLabel = (map, value) => map[value] ?? String(value ?? '');
