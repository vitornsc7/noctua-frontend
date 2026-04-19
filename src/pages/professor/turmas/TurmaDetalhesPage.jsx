import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tag, Tabs, useToast } from '../../../components/UI';
import { buscarTurmaPorId, atualizarTurma } from '../../../api/turmaApi';
import EdicaoTurmaModal from './EdicaoTurmaModal';
import VisaoGeralTab from './tabs/VisaoGeralTab';
import AlunosTab from './tabs/AlunosTab';
import AvaliacoesTab from './tabs/AvaliacoesTab';
import FaltasTab from './tabs/FaltasTab';

const TURNO_DISPLAY = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    INTEGRAL: 'Integral',
};

const PERIODICIDADE_DISPLAY = {
    4: 'Bimestral',
    3: 'Trimestral',
};

const getAno = (anoLetivo) => {
    if (!anoLetivo) return '';
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0]);
    return String(anoLetivo);
};

const TurmaDetalhesPage = () => {
    const { id } = useParams();
    const { showError, showSuccess } = useToast();

    const [turma, setTurma] = useState(null);
    const [loadingTurma, setLoadingTurma] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        buscarTurmaPorId(id)
            .then(setTurma)
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoadingTurma(false));
    }, [id]);

    const handleSalvarEdicao = (payload) => {
        atualizarTurma(id, payload)
            .then((atualizada) => {
                setTurma(atualizada);
                setEditModalOpen(false);
                showSuccess('Turma atualizada com sucesso');
            })
            .catch((err) => showError('Erro ao atualizar turma', err.message));
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

    const periodicidadeLabel = PERIODICIDADE_DISPLAY[turma.qtdePeriodos] ?? `${turma.qtdePeriodos} períodos`;

    return (
        <>
            <div className="space-y-6">
                {/* Cabeçalho */}
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

                    <div className="flex items-center gap-4 pt-1">
                        <button
                            type="button"
                            onClick={() => setEditModalOpen(true)}
                            className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition"
                        >
                            Editar turma
                        </button>
                        <Link
                            to={`/turmas/cadastro?from=${id}`}
                            className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition"
                        >
                            Nova turma a partir da atual
                        </Link>
                    </div>
                </div>

                {/* Tags de informação */}
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

                {/* Tabs */}
                <Tabs defaultTab="visao-geral">
                    <Tabs.Tab id="visao-geral" label="Visão geral">
                        <VisaoGeralTab />
                    </Tabs.Tab>

                    <Tabs.Tab id="alunos" label="Alunos">
                        <AlunosTab turma={turma} />
                    </Tabs.Tab>

                    <Tabs.Tab id="avaliacoes" label="Avaliações">
                        <AvaliacoesTab />
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
        </>
    );
};

export default TurmaDetalhesPage;
