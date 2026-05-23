export const INTERVENTION_MATRIX = {
    'alta|alta': 'Não necessária',
    'media|alta': 'Em monitoramento',
    'baixa|alta': 'Psicossocial',
    'critica|alta': 'Psicossocial',
    'alta|media': 'Em monitoramento',
    'media|media': 'Pedagógica',
    'baixa|media': 'Pedagógica',
    'critica|media': 'Urgente',
    'alta|baixa': 'Pedagógica',
    'media|baixa': 'Pedagógica',
    'baixa|baixa': 'Urgente',
    'critica|baixa': 'Urgente',
};

export const INTERVENCAO_ICON = {
    'Não necessária': 'pi pi-check',
    'Em monitoramento': 'pi pi-eye',
    'Pedagógica': 'pi pi-book',
    'Psicossocial': 'pi pi-users',
    'Urgente': 'pi pi-exclamation-triangle',
};

export const INTERVENCAO_TEXT_COLOR = {
    'Não necessária': 'text-emerald-600',
    'Em monitoramento': 'text-sky-600',
    'Pedagógica': 'text-orange-600',
    'Psicossocial': 'text-amber-600',
    'Urgente': 'text-red-600',
};

export const INTERVENCAO_CARD_COLORS = {
    emerald: { border: 'border-t-emerald-400', label: 'text-emerald-700' },
    sky: { border: 'border-t-sky-400', label: 'text-sky-700' },
    amber: { border: 'border-t-amber-400', label: 'text-amber-700' },
    orange: { border: 'border-t-orange-400', label: 'text-orange-700' },
    red: { border: 'border-t-red-400', label: 'text-red-700' },
};

export const classifyFrequencia = (freq, limites) => {
    if (freq == null || !limites) return null;
    if (freq < 75) return 'critica';
    if (freq <= limites.atencaoFim) return 'baixa';
    if (freq <= limites.regularFim) return 'media';
    return 'alta';
};

export const classifyGrade = (media, limites, mediaMinima) => {
    if (media == null || !limites || mediaMinima == null) return null;
    const min = Number(mediaMinima);
    if (media >= min + limites.pontosAcima) return 'alta';
    if (media >= min - limites.pontosAbaixo) return 'media';
    return 'baixa';
};

export const getIntervencao = (media, freq, limites, mediaMinima) => {
    const fc = classifyFrequencia(freq, limites);
    const gc = classifyGrade(media, limites, mediaMinima);
    if (!fc || !gc) return null;
    return INTERVENTION_MATRIX[`${fc}|${gc}`] ?? null;
};

export const INTERVENCOES = [
    { titulo: 'Não necessária', descricao: 'Desempenho e frequência adequados.', color: 'emerald', icon: 'pi pi-check', condicoes: [['alta', 'alta']] },
    { titulo: 'Em monitoramento', descricao: 'Necessita de acompanhamento.', color: 'sky', icon: 'pi pi-eye', condicoes: [['media', 'alta'], ['alta', 'media']] },
    { titulo: 'Pedagógica', descricao: 'Necessita reforço pedagógico.', color: 'orange', icon: 'pi pi-book', condicoes: [['baixa', 'media'], ['alta', 'baixa'], ['media', 'baixa']] },
    { titulo: 'Psicossocial', descricao: 'Possíveis fatores sociais ou emocionais.', color: 'amber', icon: 'pi pi-users', condicoes: [['baixa', 'alta'], ['critica', 'alta']] },
    { titulo: 'Urgente', descricao: 'Alto risco de evasão ou reprovação.', color: 'red', icon: 'pi pi-exclamation-triangle', condicoes: [['critica', 'media'], ['baixa', 'baixa'], ['critica', 'baixa']] },
];

export const fmtN = (n) => (n != null ? String(n).replace('.', ',') : '—');

export const freqLabel = (key, limites) => ({
    alta: `Freq. ≥${fmtN(limites?.regularFim)}%`,
    media: `Freq. ${fmtN(limites?.atencaoFim)}–${fmtN(limites?.regularFim)}%`,
    baixa: `Freq. 75–${fmtN(limites?.atencaoFim)}%`,
    critica: 'Freq. < 75%',
})[key] ?? key;

export const gradeLabel = (key, limites) => ({
    alta: `Méd. ≥mín+${fmtN(limites?.pontosAcima)}`,
    media: 'Méd. ±faixa',
    baixa: `Méd. <mín−${fmtN(limites?.pontosAbaixo)}`,
})[key] ?? key;
