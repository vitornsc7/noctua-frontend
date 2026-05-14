import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarFalta, excluirFalta, listarFaltasPorTurma } from '../../../../api/turmaApi';
import { Pageable, Select, DateInput, Table, useToast } from '../../../../components/UI';
import EditarFaltaModal from '../EditarFaltaModal';
import { Link } from 'react-router-dom';
import { PERIODO_LABEL } from '../../../../utils/displayMaps';

const PAGE_SIZE = 10;

const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
};

const FaltasTab = ({ turma }) => {
    const navigate = useNavigate();

    const qtdePeriodos = Number(turma?.qtdePeriodos) || 4;
    const periodoLabel = PERIODO_LABEL[qtdePeriodos] ?? 'Período';

    const periodoOptions = Array.from({ length: qtdePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}º ${periodoLabel}`,
    }));

    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faltaSelecionada, setFaltaSelecionada] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
    const [filtroData, setFiltroData] = useState('');
    const [page, setPage] = useState(0);
    const { showSuccess, showError } = useToast();

    const getNomeAluno = (alunoId) => {
        const aluno = turma?.alunos?.find((item) => item.id === alunoId);
        return aluno?.nome ?? `Aluno ID: ${alunoId}`;
    };

    const carregarFaltas = (periodoFiltro, dataFiltro) => {
        if (!turma?.id) return;

        setLoading(true);

        const periodo = periodoFiltro !== 'todos' ? Number(periodoFiltro) : null;
        const data = dataFiltro || null;

        listarFaltasPorTurma(turma.id, periodo, data)
            .then(setFaltas)
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

    const handleOpenEditModal = (falta) => {
        setFaltaSelecionada(falta);
        setEditModalOpen(true);
    };

    const handleSalvarEdicao = async (formData) => {
        try {
            await atualizarFalta(faltaSelecionada.id, formData);
            showSuccess('Falta atualizada com sucesso');
            setEditModalOpen(false);
            setFaltaSelecionada(null);
            carregarFaltas(filtroPeriodo, filtroData);
        } catch (err) {
            showError('Erro ao atualizar falta', err.message);
        }
    };

    const handleExcluirFalta = async (falta) => {
        try {
            await excluirFalta(falta.id);
            showSuccess('Falta excluída com sucesso');
            carregarFaltas(filtroPeriodo, filtroData);
        } catch (err) {
            showError('Erro ao excluir falta', err.message);
        }
    };

    useEffect(() => {
        carregarFaltas(filtroPeriodo, filtroData);
    }, [turma?.id, filtroPeriodo, filtroData]);

    const faltasPaginadas = faltas.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
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

            <div className="flex gap-4 flex-wrap">
                <div className="w-72">
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
                </div>
                <div className="w-72">
                    <DateInput
                        label="Data"
                        value={filtroData}
                        onChange={handleDataChange}
                        fullWidth
                    />
                </div>
            </div>

            <Table
                data={faltasPaginadas}
                loading={loading}
                emptyMessage="Nenhuma falta cadastrada."
                onEdit={handleOpenEditModal}
                onDelete={handleExcluirFalta}
                actionTooltips={{
                    edit: 'Editar falta',
                    delete: 'Excluir falta',
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

            {faltas.length > PAGE_SIZE && (
                <Pageable
                    page={page}
                    pageSize={PAGE_SIZE}
                    totalItems={faltas.length}
                    currentItemsCount={faltasPaginadas.length}
                    onPageChange={setPage}
                />
            )}

            <EditarFaltaModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSalvarEdicao}
                falta={faltaSelecionada}
                turma={turma}
            />
        </div>
    );
};

export default FaltasTab;