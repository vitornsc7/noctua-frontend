import React, { useEffect, useState } from 'react';
import { atualizarFalta, excluirFalta, listarAlunos, listarFaltasPorTurma } from '../../../../api/turmaApi';
import { Select, DateInput, Table, useToast } from '../../../../components/UI';
import EditarFaltaModal from '../EditarFaltaModal';
import { Link } from 'react-router-dom';
import { PERIODO_LABEL } from '../../../../utils/displayMaps';

const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
};

const FaltasTab = ({ turma }) => {
    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);

    const isTrimestral = qtdePeriodosTurma === 3;

    const quantidadePeriodos = isTrimestral ? 3 : 4;

    const periodoLabel = isTrimestral ? 'Trimestre' : 'Bimestre';

    const periodoOptions = Array.from({ length: quantidadePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}º ${periodoLabel}`,
    }));

    const [faltas, setFaltas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [faltaSelecionada, setFaltaSelecionada] = useState(null);
    const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
    const [filtroData, setFiltroData] = useState('');
    const [filtroAluno, setFiltroAluno] = useState('todos');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { showSuccess, showError } = useToast();

    const getNomeAluno = (alunoId) => {
        const aluno = alunos.find((item) => item.id === alunoId);
        return aluno?.nome ?? `Aluno ID: ${alunoId}`;
    };

    const carregarAlunos = () => {
        if (!turma?.id) return;
        listarAlunos(turma.id, { ativo: true, page: 0, size: 500 })
            .then((data) => setAlunos(data.content ?? []))
            .catch(() => { });
    };

    const carregarFaltas = (periodoFiltro, dataFiltro, alunoFiltro, currentPage, currentSize) => {
        if (!turma?.id) return;

        setLoading(true);

        const periodo = periodoFiltro !== 'todos' ? Number(periodoFiltro) : null;
        const data = dataFiltro || null;
        const alunoId = alunoFiltro !== 'todos' ? Number(alunoFiltro) : null;

        listarFaltasPorTurma(turma.id, periodo, data, alunoId, { page: currentPage, size: currentSize })
            .then((res) => {
                setFaltas(res.content);
                setTotalElements(res.totalElements);
            })
            .catch((err) => showError('Erro ao carregar faltas', err.message))
            .finally(() => setLoading(false));
    };

    const handleFilterChange = (value) => {
        setPage(0);
        setFiltroPeriodo(value);
    };

    const handleDataChange = (e) => {
        setPage(0);
        setFiltroData(e.target.value);
    };

    const handleLimparFiltros = () => {
        setFiltroPeriodo('todos');
        setFiltroData('');
        setFiltroAluno('todos');
        setPage(0);
    };

    const temFiltroAtivo = filtroPeriodo !== 'todos' || filtroData !== '' || filtroAluno !== 'todos';

    const handleSalvarEdicao = async (formData) => {
        try {
            await atualizarFalta(faltaSelecionada.id, formData);
            showSuccess('Falta atualizada com sucesso');
            setFaltaSelecionada(null);
            carregarFaltas(filtroPeriodo, filtroData, filtroAluno, page, pageSize);
        } catch (err) {
            showError('Erro ao atualizar falta', err.message);
        }
    };

    const handleExcluirFalta = async (falta) => {
        try {
            await excluirFalta(falta.id);
            showSuccess('Falta excluída com sucesso');
            carregarFaltas(filtroPeriodo, filtroData, filtroAluno, page, pageSize);
        } catch (err) {
            showError('Erro ao excluir falta', err.message);
        }
    };

    useEffect(() => {
        carregarAlunos();
    }, [turma?.id]);

    useEffect(() => {
        carregarFaltas(filtroPeriodo, filtroData, filtroAluno, page, pageSize);
    }, [turma?.id, filtroPeriodo, filtroData, filtroAluno, page, pageSize]);

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-700">Faltas</h2>
                    <Link
                        to={`/turmas/${turma.id}/faltas/nova`}
                        className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition"
                    >
                        Nova falta
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
                            onChange={(e) => handleFilterChange(e.target.value)}
                            fullWidth
                        >
                            <Select.Option value="todos">Todos os períodos</Select.Option>
                            {periodoOptions.map((op) => (
                                <Select.Option key={op.value} value={op.value}>
                                    {op.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <DateInput
                            label="Data"
                            value={filtroData}
                            onChange={handleDataChange}
                            fullWidth
                        />
                        <Select
                            label="Aluno"
                            value={filtroAluno}
                            onChange={(e) => { setFiltroAluno(e.target.value); setPage(0); }}
                            fullWidth
                        >
                            <Select.Option value="todos">Todos os alunos</Select.Option>
                            {(alunos).map((aluno) => (
                                <Select.Option key={aluno.id} value={String(aluno.id)}>
                                    {aluno.nome}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <Table
                    data={faltas}
                    loading={loading}
                    emptyMessage="Nenhuma falta encontrada."
                    onEdit={setFaltaSelecionada}
                    onDelete={handleExcluirFalta}
                    actionTooltips={{
                        edit: 'Editar falta',
                        delete: 'Excluir falta',
                    }}
                    pageable={{
                        page,
                        pageSize,
                        totalItems: totalElements,
                        onPageChange: setPage,
                        onPageSizeChange: (size) => { setPageSize(size); setPage(0); },
                    }}
                >
                    <Table.Column
                        header="Aluno"
                        render={(falta) => getNomeAluno(falta.alunoId)}
                    />
                    <Table.Column
                        header={periodoLabel}
                        render={(falta) => `${falta.periodo}º ${periodoLabel}`}
                    />
                    <Table.Column
                        header="Períodos faltados"
                        accessor="periodosFaltados"
                    />
                    <Table.Column
                        header="Data da falta"
                        render={(falta) => formatarData(falta.dataFalta)}
                    />
                </Table>
            </div>
            <EditarFaltaModal
                isOpen={Boolean(faltaSelecionada)}
                onClose={() => setFaltaSelecionada(null)}
                onSave={handleSalvarEdicao}
                falta={faltaSelecionada}
                turma={turma}
            />
        </>
    );
};

export default FaltasTab;