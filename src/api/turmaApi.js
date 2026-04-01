import { BASE_URL } from './config';

const TURNO_TO_ENUM = {
    Matutino: 'MATUTINO',
    Vespertino: 'VESPERTINO',
    Noturno: 'NOTURNO',
    Integral: 'INTEGRAL',
};

const PERIODICIDADE_TO_PERIODOS = {
    Bimestral: 4,
    Trimestral: 3,
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
};

export const criarTurma = async (formData) => {
    const payload = {
        nome: formData.nome.trim(),
        anoLetivo: `${formData.anoLetivo}-01-01`,
        qtdePeriodos: PERIODICIDADE_TO_PERIODOS[formData.periodicidade],
        qtdeAulasPrevistasPeriodo: Number(formData.qtdeAulasPrevistasPeriodo),
        turno: TURNO_TO_ENUM[formData.turno],
        disciplina: formData.disciplina?.trim() || null,
        mediaMinima: parseFloat(formData.mediaMinima),
        instituicao: formData.instituicao?.trim() || null,
    };

    const response = await fetch(`${BASE_URL}/turmas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

export const buscarFiltrosTurmas = async () => {
    const response = await fetch(`${BASE_URL}/turmas/filtros`);
    return handleResponse(response);
};

export const listarTurmas = async ({ page = 0, size = 10, turno, anoLetivo, instituicao } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (turno && turno !== 'todos') params.set('turno', turno);
    if (anoLetivo && anoLetivo !== 'todos') params.set('anoLetivo', anoLetivo);
    if (instituicao && instituicao !== 'todos') params.set('instituicao', instituicao);

    const response = await fetch(`${BASE_URL}/turmas?${params}`);
    return handleResponse(response);
};

export const criarAluno = async (turmaId, alunoData) => {
    const payload = {
        nome: alunoData.nome.trim(),
        observacao: alunoData.observacao?.trim() || null,
        ativo: true,
        turmaId,
    };

    const response = await fetch(`${BASE_URL}/turmas/${turmaId}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};
