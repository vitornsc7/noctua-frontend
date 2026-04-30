import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActionMenu, Tag, Tabs, useToast } from '../../../components/UI';
import { buscarTurmaPorId, atualizarTurma, excluirTurma } from '../../../api/turmaApi';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY, displayLabel } from '../../../utils/displayMaps';
import EdicaoTurmaModal from './EdicaoTurmaModal';
import ExcluirTurmaModal from './components/ExcluirTurmaModal';
import VisaoGeralTab from './tabs/VisaoGeralTab';
import AlunosTab from './tabs/AlunosTab';
import AvaliacoesTab from './tabs/AvaliacoesTab';
import FaltasTab from './tabs/FaltasTab';

const getAno = (anoLetivo) => {
    if (!anoLetivo) return '';
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0]);
    return String(anoLetivo);
};

const TurmaDetalhesPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showError, showSuccess } = useToast();

    const [turma, setTurma] = useState(null);
    const [loadingTurma, setLoadingTurma] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        buscarTurmaPorId(id)
            .then(setTurma)
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoadingTurma(false));
    }, [id, showError]);

    const handleSalvarEdicao = (payload) => {
        atualizarTurma(id, payload)
            .then((atualizada) => {
                setTurma(atualizada);
                setEditModalOpen(false);
                showSuccess('Turma atualizada com sucesso');
            })
            .catch((err) => showError('Erro ao atualizar turma', err.message));
    };

    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };

    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await excluirTurma(id);
            showSuccess('Turma excluída com sucesso');
            navigate('/turmas');
        } catch (err) {
            showError('Erro ao excluir turma', err.message);
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    if (loadingTurma) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
            </div>
        );
    }

    if (!turma) {
        return (
            <div className="space-y-4">
                <Link to="/turmas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                    <span>Turmas</span>
                </Link>
                <p className="text-gray-500 italic">Turma não encontrada.</p>
            </div>
        );
    }

    const periodicidadeLabel = displayLabel(PERIODICIDADE_DISPLAY, turma.qtdePeriodos) ?? `${turma.qtdePeriodos} períodos`;

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <Link
                            to="/turmas"
                            className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                            <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                            <span>Turmas</span>
                        </Link>
                        <h1 className="text-3xl font-semibold text-gray-700">{turma.nome}</h1>
                    </div>

                    <div className="pt-1">
                        <ActionMenu buttonLabel="Mais ações da turma">
                            {({ closeMenu }) => (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeMenu();
                                            handleOpenEditModal();
                                        }}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        <i className="pi pi-pencil text-xs" aria-hidden="true"></i>
                                        <span>Editar turma</span>
                                    </button>

                                    <Link
                                        to={`/turmas/cadastro?from=${id}`}
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        <i className="pi pi-copy text-xs" aria-hidden="true"></i>
                                        <span>Nova turma a partir da atual</span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeMenu();
                                            handleOpenDeleteModal();
                                        }}
                                        className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <i className="pi pi-trash text-xs" aria-hidden="true"></i>
                                        <span>Excluir turma</span>
                                    </button>
                                </>
                            )}
                        </ActionMenu>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Tag>{getAno(turma.anoLetivo)}</Tag>
                    <Tag>{periodicidadeLabel}</Tag>
                    <Tag>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                    <Tag>{turma.alunosCount ?? turma.alunos?.length ?? 0} Alunos</Tag>
                    <Tag>
                        Média mínima:{' '}
                        {turma.mediaMinima != null
                            ? turma.mediaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
                            : '—'}
                    </Tag>
                    {turma.disciplina && <Tag>{turma.disciplina}</Tag>}
                    {turma.instituicao && <Tag>{turma.instituicao}</Tag>}
                </div>

                <Tabs defaultTab="visao-geral">
                    <Tabs.Tab id="visao-geral" label="Visão geral">
                        <VisaoGeralTab />
                    </Tabs.Tab>

                    <Tabs.Tab id="alunos" label="Alunos">
                        <AlunosTab turma={turma} />
                    </Tabs.Tab>

                    <Tabs.Tab id="avaliacoes" label="Avaliações">
                        <AvaliacoesTab turma={turma} />
                    </Tabs.Tab>

                    <Tabs.Tab id="faltas" label="Faltas">
                        <FaltasTab />
                    </Tabs.Tab>
                </Tabs>
            </div>

            <EdicaoTurmaModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                turma={turma}
                onSave={handleSalvarEdicao}
            />

            <ExcluirTurmaModal
                isOpen={deleteModalOpen}
                turmaNome={turma?.nome}
                isDeleting={isDeleting}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default TurmaDetalhesPage;
