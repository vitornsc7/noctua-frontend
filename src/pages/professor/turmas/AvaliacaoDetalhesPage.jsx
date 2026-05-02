import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tag, Table, useToast } from '../../../components/UI';
import { buscarAvaliacaoPorId, listarNotasPorAvaliacao } from '../../../api/turmaApi';
import { TIPO_AVALIACAO_DISPLAY, displayLabel } from '../../../utils/displayMaps';

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
    const { showError } = useToast();

    const [avaliacao, setAvaliacao] = useState(null);
    const [notas, setNotas] = useState([]);
    const [loadingAvaliacao, setLoadingAvaliacao] = useState(true);
    const [loadingNotas, setLoadingNotas] = useState(true);

    useEffect(() => {
        buscarAvaliacaoPorId(turmaId, avaliacaoId)
            .then(setAvaliacao)
            .catch((err) => showError('Erro ao carregar avaliação', err.message))
            .finally(() => setLoadingAvaliacao(false));

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
    const media = avaliacao.media != null
        ? Number(avaliacao.media).toLocaleString('pt-BR', { minimumFractionDigits: 1 })
        : null;

    return (
        <div className="space-y-6">
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

            <div className="flex flex-wrap gap-2">
                <Tag>Peso: {avaliacao.peso}</Tag>
                <Tag>{formatarData(avaliacao.data)}</Tag>
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
                            : '-'
                    }
                />
            </Table>
        </div>
    );
};

export default AvaliacaoDetalhesPage;
