import client from './client';
import { TURNO_TO_ENUM, PERIODICIDADE_TO_QTDE, TIPO_AVALIACAO_TO_ENUM } from '../utils/displayMaps';

const buildTurmaPayload = (formData) => ({
    nome: formData.nome.trim(),
    anoLetivo: `${formData.anoLetivo}-01-01`,
    qtdePeriodos: PERIODICIDADE_TO_QTDE[formData.periodicidade],
    qtdeAulasPrevistasPeriodo: Number(formData.qtdeAulasPrevistasPeriodo),
    turno: TURNO_TO_ENUM[formData.turno],
    disciplina: formData.disciplina?.trim() || null,
    mediaMinima: parseFloat(formData.mediaMinima),
    instituicao: formData.instituicao?.trim() || null,
});

export const criarTurma = (formData) =>
    client.post('/turmas', buildTurmaPayload(formData));

export const atualizarTurmaComFormData = (id, formData) =>
    client.put(`/turmas/${id}`, buildTurmaPayload(formData));

export const buscarFiltrosTurmas = () =>
    client.get('/turmas/filtros');

export const listarTurmas = ({ page = 0, size = 10, turno, anoLetivo, instituicao, disciplina } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (turno && turno !== 'todos') params.set('turno', turno);
    if (anoLetivo && anoLetivo !== 'todos') params.set('anoLetivo', anoLetivo);
    if (instituicao && instituicao !== 'todos') params.set('instituicao', instituicao);
    if (disciplina && disciplina !== 'todos') params.set('disciplina', disciplina);
    return client.get(`/turmas?${params}`);
};

export const listarAlunos = (turmaId, { ativo } = {}) => {
    const params = new URLSearchParams();
    if (ativo !== undefined && ativo !== null) params.set('ativo', ativo);
    const query = params.toString();
    return client.get(`/turmas/${turmaId}/alunos${query ? `?${query}` : ''}`);
};

export const criarAluno = (turmaId, alunoData) =>
    client.post(`/turmas/${turmaId}/alunos`, {
        nome: alunoData.nome.trim(),
        observacao: alunoData.observacao?.trim() || null,
        ativo: true,
        turmaId,
    });

export const atualizarAluno = (turmaId, alunoId, alunoData) =>
    client.put(`/turmas/${turmaId}/alunos/${alunoId}`, {
        nome: alunoData.nome.trim(),
        observacao: alunoData.observacao?.trim() || null,
        ativo: alunoData.ativo !== 'inativa',
        turmaId,
    });

export const buscarTurmaPorId = (id) =>
    client.get(`/turmas/${id}`);

export const atualizarTurma = (id, payload) =>
    client.put(`/turmas/${id}`, payload);

export const excluirTurma = (id) =>
    client.delete(`/turmas/${id}`);

export const excluirAluno = (turmaId, alunoId) =>
    client.delete(`/turmas/${turmaId}/alunos/${alunoId}`);

export const listarAvaliacoes = (turmaId) =>
    client.get(`/turmas/${turmaId}/avaliacoes`);

export const criarAvaliacao = (turmaId, formData) =>
    client.post(`/turmas/${turmaId}/avaliacoes`, {
        tema: formData.tema.trim(),
        data: `${formData.data}T00:00:00`,
        peso: Number(formData.peso),
        tipo: TIPO_AVALIACAO_TO_ENUM[formData.tipo] ?? formData.tipo,
        periodo: Number(formData.periodo),
        turmaId: Number(turmaId),
        alunosIds: formData.alunosIds,
    });

export const buscarAvaliacaoPorId = (turmaId, avaliacaoId) =>
    client.get(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}`);

export const listarNotasPorAvaliacao = (turmaId, avaliacaoId) =>
    client.get(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/notas`);

