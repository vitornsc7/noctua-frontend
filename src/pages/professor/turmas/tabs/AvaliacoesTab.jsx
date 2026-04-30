import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, Tag, useToast } from '../../../../components/UI';
import { listarAvaliacoes } from '../../../../api/turmaApi';
import { TIPO_AVALIACAO_DISPLAY, PERIODICIDADE_DISPLAY, PERIODO_LABEL, displayLabel } from '../../../../utils/displayMaps';

const formatarData = (data) => {
    if (!data) return '';
    if (Array.isArray(data)) {
        const [year, month, day] = data;
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
};

const getPeriodLabel = (periodo, qtdePeriodos) => {
    const tipo = displayLabel(PERIODO_LABEL, qtdePeriodos);
    return `${periodo}º ${tipo}`;
};

const AvaliacoesTab = ({ turma }) => {
    const { showError } = useToast();
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('todos');

    useEffect(() => {
        if (!turma?.id) return;
        listarAvaliacoes(turma.id)
            .then(setAvaliacoes)
            .catch((err) => showError('Erro ao carregar avaliações', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, showError]);

    const qtdePeriodos = turma?.qtdePeriodos ?? 4;

    const periodoOptions = Array.from({ length: qtdePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: getPeriodLabel(i + 1, qtdePeriodos),
    }));

    const avaliacoesFiltradas = filtroPeriodo === 'todos'
        ? avaliacoes
        : avaliacoes.filter((a) => String(a.periodo) === filtroPeriodo);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Avaliações</h2>
                <Link
                    to={`/turmas/${turma?.id}/avaliacoes/nova`}
                    className="text-sm text-[#3b5bdb] hover:underline"
                >
                    Nova avaliação
                </Link>
            </div>

            <div className="flex gap-4 flex-wrap">
                <div className="w-72">
                    <Select
                        label="Bimestre"
                        value={filtroPeriodo}
                        onChange={setFiltroPeriodo}
                        fullWidth
                    >
                        <Select.Option value="todos">Todos os períodos</Select.Option>
                        {periodoOptions.map((op) => (
                            <Select.Option key={op.value} value={op.value}>
                                {op.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
                </div>
            ) : avaliacoesFiltradas.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-8">
                    Nenhuma avaliação encontrada.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {avaliacoesFiltradas.map((av) => (
                        <Link
                            key={av.id}
                            to={`/turmas/${turma.id}/avaliacoes/${av.id}`}
                            className="block bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
                        >
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    {displayLabel(TIPO_AVALIACAO_DISPLAY, av.tipo)}: {av.tema}
                                </p>
                            </div>
                            <div className="px-4 py-3 space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Média: </span>
                                    {av.media != null
                                        ? `${Number(av.media).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} / 10`
                                        : '— / 10'}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <Tag>Peso: {av.peso}</Tag>
                                    <Tag>{formatarData(av.data)}</Tag>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvaliacoesTab;

