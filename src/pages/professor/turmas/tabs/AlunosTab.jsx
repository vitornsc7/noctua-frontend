import React, { useCallback, useEffect, useState } from 'react';
import { Select, Table, useToast } from '../../../../components/UI';
import { criarAluno, atualizarAluno, listarAlunos } from '../../../../api/turmaApi';
import AddAlunoModal from '../components/AddAlunoModal';

const FILTRO_MATRICULA_OPTIONS = [
    { value: 'ativa', label: 'Matrícula ativa' },
    { value: 'inativa', label: 'Matrícula inativa' },
];

const FILTRO_TO_ATIVO = { ativa: true, inativa: false };

const AlunosTab = ({ turma }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAluno, setEditingAluno] = useState(null);
    const [filtroMatricula, setFiltroMatricula] = useState('ativa');
    const [alunos, setAlunos] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { showError, showSuccess } = useToast();

    const fetchAlunos = useCallback(() => {
        if (!turma?.id) return;
        setLoading(true);
        listarAlunos(turma.id, { ativo: FILTRO_TO_ATIVO[filtroMatricula], page, size: pageSize })
            .then((data) => {
                setAlunos(data.content);
                setTotalElements(data.totalElements);
            })
            .catch((err) => showError('Erro ao carregar alunos', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, filtroMatricula, page, pageSize, showError]);

    useEffect(() => {
        fetchAlunos();
    }, [fetchAlunos]);

    const handleSave = (data) => {
        setIsSaving(true);
        criarAluno(turma.id, data)
            .then(() => {
                showSuccess('Aluno adicionado com sucesso', 'O aluno foi cadastrado na turma.');
                setIsAddModalOpen(false);
                fetchAlunos();
            })
            .catch((err) => showError('Erro ao adicionar aluno', err.message))
            .finally(() => setIsSaving(false));
    };

    const handleEdit = (aluno) => {
        setEditingAluno({
            ...aluno,
            ativo: aluno.ativo ? 'ativa' : 'inativa',
        });
    };

    const handleSaveEdit = (data) => {
        setIsSaving(true);
        atualizarAluno(turma.id, editingAluno.id, data)
            .then(() => {
                showSuccess('Aluno atualizado com sucesso', 'As informações do aluno foram salvas.');
                setEditingAluno(null);
                fetchAlunos();
            })
            .catch((err) => showError('Erro ao atualizar aluno', err.message))
            .finally(() => setIsSaving(false));
    };

    return (
        <>
            <div className='space-y-6 mb-10'>
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
                            onChange={(e) => { setFiltroMatricula(e.target.value); setPage(0); }}
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
                    pageable={{
                        page,
                        pageSize,
                        totalItems: totalElements,
                        onPageChange: setPage,
                        onPageSizeChange: (size) => { setPageSize(size); setPage(0); },
                    }}
                >
                    <Table.Column header="Nome" accessor="nome" />
                    <Table.Column header="Observação" accessor="observacao" />
                </Table>
            </div>

            <AddAlunoModal
                isOpen={isAddModalOpen}
                isLoading={isSaving}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSave}
            />

            <AddAlunoModal
                isOpen={Boolean(editingAluno)}
                isEditing
                isLoading={isSaving}
                initialData={editingAluno}
                onClose={() => setEditingAluno(null)}
                onSave={handleSaveEdit}
            />
        </>
    );
};

export default AlunosTab;
