import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Table } from '../../../../components/UI';
import AddAlunoModal from '../components/AddAlunoModal';
import { criarAluno, atualizarAluno, excluirAluno } from '../../../../api/turmaApi';
import { ALUNO_INITIAL_VALUES } from '../cadastroTurmaSchema';

const AlunosStep = ({ turmaId, initialAlunos, onChange, onNext, onBack, showError }) => {
    const [alunos, setAlunos] = useState(initialAlunos);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAluno, setEditingAluno] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const updateAlunos = (updated) => {
        setAlunos(updated);
        onChange(updated);
    };

    const openAddModal = () => {
        setEditingAluno(null);
        setModalOpen(true);
    };

    const openEditModal = (aluno) => {
        setEditingAluno(aluno);
        setModalOpen(true);
    };

    const handleSave = async (alunoData) => {
        setIsSaving(true);
        try {
            if (editingAluno) {
                await atualizarAluno(turmaId, editingAluno.id, alunoData);
                updateAlunos(
                    alunos.map((a) =>
                        a.id === editingAluno.id
                            ? { ...a, nome: alunoData.nome, observacao: alunoData.observacao }
                            : a,
                    ),
                );
            } else {
                const created = await criarAluno(turmaId, alunoData);
                updateAlunos([
                    ...alunos,
                    { id: created.id, nome: created.nome, observacao: created.observacao ?? '' },
                ]);
            }
            setModalOpen(false);
        } catch (err) {
            showError('Erro ao salvar aluno.', err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (aluno) => {
        setDeletingId(aluno.id);
        try {
            await excluirAluno(turmaId, aluno.id);
            updateAlunos(alunos.filter((a) => a.id !== aluno.id));
        } catch (err) {
            showError('Erro ao remover aluno.', err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const footer = (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
                {alunos.length}{' '}
                {alunos.length === 1 ? 'aluno adicionado' : 'alunos adicionados'}
            </p>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onBack} disabled={isSaving || deletingId !== null}>
                    Voltar
                </Button>
                <Button variant="primary" onClick={onNext} disabled={isSaving || deletingId !== null}>
                    Prosseguir
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Card
                footer={footer}
                header={
                    <div className="flex justify-between">
                        <h2 className="text-lg font-medium text-gray-700">Adicionar alunos à turma</h2>
                        <Button
                            variant="primary"
                            onClick={openAddModal}
                            disabled={isSaving || deletingId !== null}
                        >
                            <i className="pi pi-plus text-xs" /> Adicionar aluno
                        </Button>
                    </div>
                }
            >
                <Table
                    data={alunos}
                    rowKey="id"
                    emptyMessage="Nenhum aluno adicionado ainda."
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    actionTooltips={{ edit: 'Editar aluno', delete: 'Remover aluno' }}
                >
                    <Table.Column header="Nome" accessor="nome" />
                    <Table.Column
                        header="Observação"
                        accessor="observacao"
                        render={(row) => <span>{row.observacao || '--'}</span>}
                    />
                </Table>
            </Card>

            <AddAlunoModal
                isOpen={modalOpen}
                isEditing={Boolean(editingAluno)}
                isLoading={isSaving}
                initialData={
                    editingAluno
                        ? { nome: editingAluno.nome, observacao: editingAluno.observacao }
                        : ALUNO_INITIAL_VALUES
                }
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        </>
    );
};

AlunosStep.propTypes = {
    turmaId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    initialAlunos: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
};

export default AlunosStep;
