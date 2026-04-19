import client from './client';

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

export const criarTurma = (formData) =>
    client.post('/turmas', {
        nome: formData.nome.trim(),
        anoLetivo: `${formData.anoLetivo}-01-01`,
        qtdePeriodos: PERIODICIDADE_TO_PERIODOS[formData.periodicidade],
        qtdeAulasPrevistasPeriodo: Number(formData.qtdeAulasPrevistasPeriodo),
        turno: TURNO_TO_ENUM[formData.turno],
        disciplina: formData.disciplina?.trim() || null,
        mediaMinima: parseFloat(formData.mediaMinima),
        instituicao: formData.instituicao?.trim() || null,
    });

export const buscarFiltrosTurmas = () =>
    client.get('/turmas/filtros');

export const listarTurmas = ({ page = 0, size = 10, turno, anoLetivo, instituicao } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (turno && turno !== 'todos') params.set('turno', turno);
    if (anoLetivo && anoLetivo !== 'todos') params.set('anoLetivo', anoLetivo);
    if (instituicao && instituicao !== 'todos') params.set('instituicao', instituicao);
    return client.get(`/turmas?${params}`);
};

export const criarAluno = (turmaId, alunoData) =>
    client.post(`/turmas/${turmaId}/alunos`, {
        nome: alunoData.nome.trim(),
        observacao: alunoData.observacao?.trim() || null,
        ativo: true,
        turmaId,
    });

export const buscarTurmaPorId = (id) =>
    client.get(`/turmas/${id}`);

export const atualizarTurma = (id, payload) =>
    client.put(`/turmas/${id}`, payload);

export const excluirTurma = (id) =>
    client.delete(`/turmas/${id}`);

