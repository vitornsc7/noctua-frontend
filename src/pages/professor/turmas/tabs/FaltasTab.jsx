import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { atualizarFalta, excluirFalta, listarFaltasPorTurma } from '../../../../api/turmaApi';
import { Button, Table, useToast } from '../../../../components/UI';
import EditarFaltaModal from '../EditarFaltaModal';

const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
};

const FaltasTab = ({ turma }) => {
    const navigate = useNavigate();

    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faltaSelecionada, setFaltaSelecionada] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const { showSuccess, showError } = useToast();

    const getNomeAluno = (alunoId) => {
        const aluno = turma?.alunos?.find((item) => item.id === alunoId);
        return aluno?.nome ?? `Aluno ID: ${alunoId}`;
    };

    const carregarFaltas = () => {
        if (!turma?.id) return;

        setLoading(true);

        listarFaltasPorTurma(turma.id)
            .then(setFaltas)
            .catch((err) => showError('Erro ao carregar faltas', err.message))
            .finally(() => setLoading(false));
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
            carregarFaltas();
        } catch (err) {
            showError('Erro ao atualizar falta', err.message);
        }
    };

    const handleExcluirFalta = async (falta) => {
        try {
            await excluirFalta(falta.id);
            showSuccess('Falta excluída com sucesso');
            carregarFaltas();
        } catch (err) {
            showError('Erro ao excluir falta', err.message);
        }
    };

    useEffect(() => {
        carregarFaltas();
    }, [turma?.id]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-700">Faltas</h2>

                <Button
                    variant="primary"
                    onClick={() => navigate(`/turmas/${turma.id}/faltas/nova`)}
                >
                    + Nova falta
                </Button>
            </div>

            <Table
                data={faltas}
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
                    header="Período"
                    accessor="periodo"
                />

                <Table.Column
                    header="Data da falta"
                    render={(falta) => formatarData(falta.dataFalta)}
                />
            </Table>

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