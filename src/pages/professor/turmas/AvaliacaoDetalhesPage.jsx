import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActionMenu, Button, Modal, Tag, Table, Tooltip, useToast } from '../../../components/UI';
import { buscarAvaliacaoPorId, buscarTurmaPorId, criarChamada, listarNotasPorAvaliacao, atualizarNota } from '../../../api/turmaApi';
import { TIPO_AVALIACAO_DISPLAY, displayLabel, normalizeNumber } from '../../../utils/displayMaps';
import TurmaTags from './components/TurmaTags';
import EditarNotaModal from './EditarNotaModal';

const formatarData = (data) => {
    if (!data) return '';
    if (Array.isArray(data)) {
        const [year, month, day] = data;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
};

const AvaliacaoDetalhesPage = () => {
    const { id: turmaId, avaliacaoId } = useParams();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const [avaliacao, setAvaliacao] = useState(null);
    const [turma, setTurma] = useState(null);
    const [notas, setNotas] = useState([]);
    const [loadingAvaliacao, setLoadingAvaliacao] = useState(true);
    const [loadingNotas, setLoadingNotas] = useState(true);
    const [notaEditando, setNotaEditando] = useState(null);
    const [savingNota, setSavingNota] = useState(false);
    const [chamadaModalOpen, setChamadaModalOpen] = useState(false);
    const [criandoChamada, setCriandoChamada] = useState(false);

    const mediaMinima = normalizeNumber(turma?.mediaMinima);

    const handleSaveNota = async (payload) => {
        setSavingNota(true);
        try {
            await atualizarNota(turmaId, avaliacaoId, notaEditando.id, payload);
            const novasNotas = await listarNotasPorAvaliacao(turmaId, avaliacaoId);
            setNotas(novasNotas);
            setNotaEditando(null);
            showSuccess('Nota atualizada com sucesso.', 'A nota do aluno foi salva.');
        } catch (err) {
            showError('Erro ao salvar nota', err.message);
        } finally {
            setSavingNota(false);
        }
    };

    const handleCriarChamada = async () => {
        setCriandoChamada(true);
        try {
            const nova = await criarChamada(turmaId, avaliacaoId);
            showSuccess(`${nova.numeroChamada}ª Chamada criada com sucesso.`, 'A avaliação foi criada com os alunos que não compareceram.');
            setChamadaModalOpen(false);
            navigate(`/turmas/${turmaId}/avaliacoes/${nova.id}`);
        } catch (err) {
            showError('Erro ao criar chamada', err.message);
        } finally {
            setCriandoChamada(false);
        }
    };

    useEffect(() => {
        buscarAvaliacaoPorId(turmaId, avaliacaoId)
            .then(setAvaliacao)
            .catch((err) => showError('Erro ao carregar avaliação', err.message))
            .finally(() => setLoadingAvaliacao(false));

        buscarTurmaPorId(turmaId)
            .then(setTurma)
            .catch(() => { });

        listarNotasPorAvaliacao(turmaId, avaliacaoId)
            .then(setNotas)
            .catch((err) => showError('Erro ao carregar notas', err.message))
            .finally(() => setLoadingNotas(false));
    }, [turmaId, avaliacaoId, showError]);

    if (loadingAvaliacao) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
            </div>
        );
    }

    if (!avaliacao) {
        return (
            <div className="space-y-4">
                <Link
                    to={`/turmas/${turmaId}`}
                    state={{ tab: 'avaliacoes' }}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                    <span>Avaliações</span>
                </Link>
                <p className="text-gray-500 italic">Avaliação não encontrada.</p>
            </div>
        );
    }

    const tipoDisplay = displayLabel(TIPO_AVALIACAO_DISPLAY, avaliacao.tipo);
    const titulo = `${tipoDisplay}: ${avaliacao.tema}`;

    const notasComValor = notas.filter((n) => n.valor != null);
    const media = notasComValor.length > 0
        ? (notasComValor.reduce((sum, n) => sum + Number(n.valor), 0) / notasComValor.length)
            .toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
        : null;

    const alunosNaoCompareceram = notas.filter((n) => Boolean(n.naoRealizada));
    const proximaChamada = (avaliacao.numeroChamada ?? 1) + 1;
    const temNaoCompareceram = alunosNaoCompareceram.length > 0;
    const chamadaLabel = `${proximaChamada}ª Chamada`;

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link
                        to={`/turmas/${turmaId}`}
                        state={{ tab: 'avaliacoes' }}
                        className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                        <span>Avaliações</span>
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-700">{titulo}</h1>
                </div>
                <div className="pt-1">
                    <ActionMenu buttonLabel="Mais ações da avaliação">
                        {({ closeMenu }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMenu();
                                        navigate(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/editar`);
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-700"
                                >
                                    <i className="pi pi-pencil text-xs" aria-hidden="true" />
                                    <span>Editar avaliação</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMenu();
                                        navigate(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/lancar-notas`);
                                    }}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-700"
                                >
                                    <i className="pi pi-upload text-xs" aria-hidden="true" />
                                    <span>Lançar notas</span>
                                </button>
                                {temNaoCompareceram ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeMenu();
                                            setChamadaModalOpen(true);
                                        }}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        <i className="pi pi-refresh text-xs" aria-hidden="true" />
                                        <span>{chamadaLabel}</span>
                                    </button>
                                ) : (
                                    <Tooltip className='w-full' content="Nenhum aluno marcado como não compareceu.">
                                        <button
                                            type="button"
                                            disabled
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300"
                                        >
                                            <i className="pi pi-refresh text-xs" aria-hidden="true" />
                                            <span>{chamadaLabel}</span>
                                        </button>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </ActionMenu>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <Tag>Tipo: {tipoDisplay}</Tag>
                <Tag>Peso: {avaliacao.peso}</Tag>
                <Tag>Data aplicação: {formatarData(avaliacao.data)}</Tag>
                <Tag>Média mínima da instituição: {mediaMinima}</Tag>
            </div>

            {media != null && (
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 inline-flex items-center gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Média</p>
                        <p className="text-3xl font-semibold text-gray-700">{media}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <p className="text-sm text-gray-500">
                        {notasComValor.length} de {notas.length} alunos com nota lançada
                    </p>
                </div>
            )}

            <Table
                data={notas}
                rowKey="id"
                loading={loadingNotas}
                emptyMessage="Nenhum aluno associado a esta avaliação."
                onEdit={setNotaEditando}
            >
                <Table.Column
                    header="Aluno"
                    accessor="alunoNome"
                />
                <Table.Column
                    header="Nota"
                    render={(nota) =>
                        nota.valor != null
                            ? Number(nota.valor).toLocaleString('pt-BR', { minimumFractionDigits: 1 })
                            : nota.naoRealizada
                                ? <span className="text-gray-400 italic text-sm">Não compareceu</span>
                                : '-'
                    }
                />
            </Table>

            <EditarNotaModal
                isOpen={Boolean(notaEditando)}
                onClose={() => setNotaEditando(null)}
                onSave={handleSaveNota}
                nota={notaEditando}
                saving={savingNota}
            />

            <Modal
                isOpen={chamadaModalOpen}
                onClose={() => setChamadaModalOpen(false)}
                title={`Criar ${chamadaLabel}`}
                maxWidth="max-w-md"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setChamadaModalOpen(false)} disabled={criandoChamada}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCriarChamada} disabled={criandoChamada}>
                            {criandoChamada && <i className="pi pi-spin pi-spinner" aria-hidden="true" />}
                            Confirmar
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Apenas os alunos marcados como <span className="font-medium">não compareceu</span> irão para essa prova.
                    </p>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Alunos</p>
                        <p className="text-sm text-gray-700">
                            {alunosNaoCompareceram.map((n) => n.alunoNome).join(', ')}.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AvaliacaoDetalhesPage;
