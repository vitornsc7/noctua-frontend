import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pageable, Select, Tag, useToast } from '../../../../components/UI';
import { listarAvaliacoes } from '../../../../api/turmaApi';
import { TIPO_AVALIACAO_DISPLAY, PERIODO_LABEL, displayLabel } from '../../../../utils/displayMaps';

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
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroConcluida, setFiltroConcluida] = useState('todos');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const qtdePeriodos = Number(turma?.qtdePeriodos) || 4;
    const periodoLabel = PERIODO_LABEL[qtdePeriodos] ?? 'Período';

    const periodoOptions = Array.from({ length: qtdePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: getPeriodLabel(i + 1, qtdePeriodos),
    }));

    const carregarAvaliacoes = (periodoFiltro, tipoFiltro, concluidaFiltro, currentPage, currentSize) => {
        if (!turma?.id) return;
        setLoading(true);
        const periodo = periodoFiltro !== 'todos' ? Number(periodoFiltro) : null;
        const tipo = tipoFiltro !== 'todos' ? tipoFiltro : null;
        const concluida = concluidaFiltro !== 'todos' ? concluidaFiltro === 'true' : null;
        listarAvaliacoes(turma.id, periodo, tipo, concluida, { page: currentPage, size: currentSize })
            .then((res) => {
                setAvaliacoes(res.content);
                setTotalElements(res.totalElements);
            })
            .catch((err) => showError('Erro ao carregar avaliações', err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarAvaliacoes(filtroPeriodo, filtroTipo, filtroConcluida, page, pageSize);
    }, [turma?.id, filtroPeriodo, filtroTipo, filtroConcluida, page, pageSize]);

    const temFiltroAtivo = filtroPeriodo !== 'todos' || filtroTipo !== 'todos' || filtroConcluida !== 'todos';

    const handleLimparFiltros = () => {
        setFiltroPeriodo('todos');
        setFiltroTipo('todos');
        setFiltroConcluida('todos');
        setPage(0);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Avaliações</h2>
                <Link
                    to={`/turmas/${turma?.id}/avaliacoes/nova`}
                    className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition"
                >
                    Nova avaliação
                </Link>
            </div>

            <div className='space-y-2'>
                <div className='flex flex-row justify-between items-center'>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <i className="pi pi-filter text-xs"></i>
                        Filtros
                    </p>
                    {temFiltroAtivo && (
                        <p
                            onClick={handleLimparFiltros}
                            className="text-xs text-gray-500 hover:text-gray-600 transition cursor-pointer"
                        >
                            Limpar filtros
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <Select
                        label={periodoLabel}
                        value={filtroPeriodo}
                        onChange={(e) => { setFiltroPeriodo(e.target.value); setPage(0); }}
                        fullWidth
                    >
                        <Select.Option value="todos">Todos os períodos</Select.Option>
                        {periodoOptions.map((op) => (
                            <Select.Option key={op.value} value={op.value}>
                                {op.label}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        label="Tipo"
                        value={filtroTipo}
                        onChange={(e) => { setFiltroTipo(e.target.value); setPage(0); }}
                        fullWidth
                    >
                        <Select.Option value="todos">Todos os tipos</Select.Option>
                        {Object.entries(TIPO_AVALIACAO_DISPLAY).map(([key, label]) => (
                            <Select.Option key={key} value={key}>{label}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        label="Status"
                        value={filtroConcluida}
                        onChange={(e) => { setFiltroConcluida(e.target.value); setPage(0); }}
                        fullWidth
                    >
                        <Select.Option value="todos">Todos</Select.Option>
                        <Select.Option value="true">Concluída</Select.Option>
                        <Select.Option value="false">Não concluída</Select.Option>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
                </div>
            ) : avaliacoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                    <div className='flex flex-row gap-3 items-center'>
                        <i className="pi pi-file text-1xl text-gray-500"></i>
                        <p className="text-gray-500 font-medium">Nenhuma avaliação encontrada</p>
                    </div>
                    <p className="text-sm text-gray-400">Ajuste os filtros ou crie uma nova avaliação.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {avaliacoes.map((av) => (
                            <Link
                                key={av.id}
                                to={`/turmas/${turma.id}/avaliacoes/${av.id}`}
                                className="block bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 rounded-t-lg">
                                    <p className="text-xs uppercase tracking-wide">
                                        {displayLabel(TIPO_AVALIACAO_DISPLAY, av.tipo)}: {av.tema}{(av.numeroChamada ?? 1) > 1 ? ` - ${av.numeroChamada}ª Chamada` : ''}
                                    </p>
                                </div>
                                <div className="px-4 py-3 space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Média: </span>
                                        {av.media != null
                                            ? `${Number(av.media).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} / 10`
                                            : '- / 10'}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <Tag>Peso: {av.peso}</Tag>
                                        <Tag>{formatarData(av.data)}</Tag>
                                        <Tag>
                                            {av.concluida ? 'Concluída' : 'Não concluída'}
                                        </Tag>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {totalElements > pageSize && (
                        <Pageable
                            page={page}
                            pageSize={pageSize}
                            totalItems={totalElements}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => { setPageSize(size); setPage(0); }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default AvaliacoesTab;

