import client from './client';
import { TURNO_TO_ENUM, PERIODICIDADE_TO_QTDE, TIPO_AVALIACAO_TO_ENUM } from '../utils/displayMaps';

const buildTurmaPayload = (formData) => ({
    nome: formData.nome.trim(),
    anoLetivo: `${formData.anoLetivo}-01-01`,
    qtdePeriodos: PERIODICIDADE_TO_QTDE[formData.periodicidade],
    qtdeAulasPrevistasPeriodo: Number(formData.qtdeAulasPrevistasPeriodo),
    turno: TURNO_TO_ENUM[formData.turno],
    disciplina: formData.disciplina?.trim() || null,
    mediaMinima: parseFloat(String(formData.mediaMinima).replace(',', '.')),
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

export const listarAlunos = (turmaId, { ativo, page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (ativo !== undefined && ativo !== null) params.set('ativo', ativo);
    return client.get(`/turmas/${turmaId}/alunos?${params}`);
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

export const importarAlunosComIA = (turmaId, arquivo) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const token = localStorage.getItem('token');
    return fetch(`/api/turmas/${turmaId}/alunos/importar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    }).then(async (response) => {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Erro HTTP ${response.status}`);
        }
        return response.json();
    });
};

export const listarAvaliacoes = (turmaId, periodo, tipo, concluida, { page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (periodo != null) params.set('periodo', periodo);
    if (tipo != null) params.set('tipo', tipo);
    if (concluida != null) params.set('concluida', concluida);
    return client.get(`/turmas/${turmaId}/avaliacoes?${params}`);
};

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

export const atualizarAvaliacao = (turmaId, avaliacaoId, formData) =>
    client.put(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}`, {
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

export const atualizarNota = (turmaId, avaliacaoId, notaId, payload) =>
    client.put(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/notas/${notaId}`, payload);

export const criarChamada = (turmaId, avaliacaoId) =>
    client.post(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/chamada`);

export const listarFaltasPorTurma = (turmaId, periodo, dataFalta, alunoId, { page = 0, size = 10 } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (periodo != null) params.set('periodo', periodo);
    if (dataFalta != null) params.set('dataFalta', dataFalta);
    if (alunoId != null) params.set('alunoId', alunoId);
    return client.get(`/frequencias/turma/${turmaId}?${params}`);
};

export const listarFaltasPorAluno = (alunoId) =>
    client.get(`/frequencias/aluno/${alunoId}`);

const formatarDataFalta = (dataFalta) =>
    dataFalta?.includes('T') ? dataFalta : `${dataFalta}T00:00:00`;

export const registrarFalta = (formData) =>
    client.post('/frequencias', {
        dataFalta: formatarDataFalta(formData.dataFalta),
        periodo: Number(formData.periodo),
        alunoId: Number(formData.alunoId),
        periodosFaltados: Number(formData.periodosFaltados),
    });

export const atualizarFalta = (faltaId, formData) =>
    client.put(`/frequencias/${faltaId}`, {
        dataFalta: formatarDataFalta(formData.dataFalta),
        periodo: Number(formData.periodo),
        alunoId: Number(formData.alunoId),
        periodosFaltados: Number(formData.periodosFaltados),
    });

export const excluirFalta = (faltaId) =>
    client.delete(`/frequencias/${faltaId}`);

export const calcularPercentualFrequencia = (alunoId, periodo) =>
    client.get(`/frequencias/aluno/${alunoId}/periodo/${periodo}/percentual`);

export const classificarFrequencia = (alunoId, periodo) =>
    client.get(`/frequencias/aluno/${alunoId}/periodo/${periodo}/classificacao`);
