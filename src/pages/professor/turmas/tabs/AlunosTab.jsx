import React, { useCallback, useEffect, useState } from 'react';
import { Select, Table, useToast } from '../../../../components/UI';
import { criarAluno, atualizarAluno, listarAlunos } from '../../../../api/turmaApi';
import AddAlunoModal from '../components/AddAlunoModal';

const FILTRO_MATRICULA_OPTIONS = [
    { value: 'ativa', label: 'Matrícula ativa' },
    { value: 'inativa', label: 'Matrícula inativa' },
    { value: 'todos', label: 'Todas as matrículas' },
];

const FILTRO_TO_ATIVO = { ativa: true, inativa: false, todos: undefined };

const AlunosTab = ({ turma }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAluno, setEditingAluno] = useState(null);
    const [filtroMatricula, setFiltroMatricula] = useState('ativa');
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError, showSuccess } = useToast();

    const fetchAlunos = useCallback(() => {
        if (!turma?.id) return;
        setLoading(true);
        listarAlunos(turma.id, { ativo: FILTRO_TO_ATIVO[filtroMatricula] })
            .then((data) => setAlunos([...data].sort((a, b) => a.nome.localeCompare(b.nome))))
            .catch((err) => showError('Erro ao carregar alunos', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, filtroMatricula, showError]);

    useEffect(() => {
        fetchAlunos();
    }, [fetchAlunos]);

    const handleSave = (data) => {
        criarAluno(turma.id, data)
            .then(() => {
                showSuccess('Aluno adicionado com sucesso');
                setIsAddModalOpen(false);
                fetchAlunos();
            })
            .catch((err) => showError('Erro ao adicionar aluno', err.message));
    };

    const handleEdit = (aluno) => {
        setEditingAluno({
            ...aluno,
            ativo: aluno.ativo ? 'ativa' : 'inativa',
        });
    };

    const handleSaveEdit = (data) => {
        atualizarAluno(turma.id, editingAluno.id, data)
            .then(() => {
                showSuccess('Aluno atualizado com sucesso');
                setEditingAluno(null);
                fetchAlunos();
            })
            .catch((err) => showError('Erro ao atualizar aluno', err.message));
    };

    return (
        <>
            <div className='space-y-6'>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-700">Alunos</h2>
                    <p
                        className="pt-1 text-sm text-gray-600 underline underline-offset-4 hover:text-gray-700 transition hover:cursor-pointer"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Adicionar aluno
                    </p>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <div className="w-72">
                        <Select
                            label="Matrícula"
                            value={filtroMatricula}
                            onChange={(e) => setFiltroMatricula(e.target.value)}
                            fullWidth
                        >
                            {FILTRO_MATRICULA_OPTIONS.map((op) => (
                                <Select.Option key={op.value} value={op.value}>
                                    {op.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <Table
                    data={alunos}
                    rowKey="id"
                    loading={loading}
                    emptyMessage="Nenhum aluno encontrado."
                    onEdit={handleEdit}
                >
                    <Table.Column header="Nome" accessor="nome" />
                    <Table.Column header="Observação" accessor="observacao" />
                </Table>
            </div>

            <AddAlunoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSave}
            />

            <AddAlunoModal
                isOpen={Boolean(editingAluno)}
                isEditing
                initialData={editingAluno}
                onClose={() => setEditingAluno(null)}
                onSave={handleSaveEdit}
            />
        </>
    );
};

export default AlunosTab;
