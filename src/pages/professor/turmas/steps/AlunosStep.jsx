import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Table } from '../../../../components/UI';
import AddAlunoModal from '../components/AddAlunoModal';
import ExcluirAlunoModal from '../components/ExcluirAlunoModal';
import ImportarComIAModal from '../components/ImportarComIAModal';
import { criarAluno, atualizarAluno, excluirAluno, importarAlunosComIA } from '../../../../api/turmaApi';
import { ALUNO_INITIAL_VALUES } from '../cadastroTurmaSchema';

const AlunosStep = ({ turmaId, initialAlunos, onChange, onNext, onBack, showError }) => {
    const [alunos, setAlunos] = useState(initialAlunos);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAluno, setEditingAluno] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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

    const handleConfirmDelete = async () => {
        if (!alunoParaExcluir) return;
        setIsDeleting(true);
        try {
            await excluirAluno(turmaId, alunoParaExcluir.id);
            updateAlunos(alunos.filter((a) => a.id !== alunoParaExcluir.id));
            setAlunoParaExcluir(null);
        } catch (err) {
            showError('Erro ao remover aluno.', err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleImportarComIA = async (arquivo) => {
        setIsImporting(true);
        try {
            const { nomes } = await importarAlunosComIA(turmaId, arquivo);
            if (!nomes || nomes.length === 0) {
                showError('Nenhum aluno identificado', 'Nenhum nome de aluno foi identificado na imagem. Tente com outro arquivo.');
                return;
            }
            const criados = await Promise.all(
                nomes.map((nome) => criarAluno(turmaId, { nome, observacao: '' }))
            );
            updateAlunos([
                ...alunos,
                ...criados.map((c) => ({ id: c.id, nome: c.nome, observacao: c.observacao ?? '' })),
            ]);
            setImportModalOpen(false);
        } catch (err) {
            showError('Recurso indisponível', 'Estamos com problemas com este recurso no momento. Entre em contato com o suporte.');
        } finally {
            setIsImporting(false);
        }
    };

    const isBusy = isSaving || isDeleting || isImporting;

    const footer = (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
                {alunos.length}{' '}
                {alunos.length === 1 ? 'aluno adicionado' : 'alunos adicionados'}
            </p>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onBack} disabled={isBusy}>
                    Voltar
                </Button>
                <Button variant="primary" onClick={onNext} disabled={isBusy}>
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
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setImportModalOpen(true)}
                                disabled={isBusy}
                                title="Importar lista de alunos a partir de uma imagem ou PDF usando IA"
                            >
                                <i className="pi pi-sparkles text-xs" /> Importar com IA
                            </Button>
                            <Button
                                variant="primary"
                                onClick={openAddModal}
                                disabled={isBusy}
                            >
                                <i className="pi pi-plus text-xs" /> Adicionar aluno
                            </Button>
                        </div>
                    </div>
                }
            >
                <Table
                    data={alunos.slice(page * pageSize, (page + 1) * pageSize)}
                    rowKey="id"
                    emptyMessage="Nenhum aluno adicionado ainda."
                    onEdit={openEditModal}
                    onDelete={(aluno) => setAlunoParaExcluir(aluno)}
                    actionTooltips={{ edit: 'Editar aluno', delete: 'Remover aluno' }}
                    pageable={{
                        page,
                        pageSize,
                        totalItems: alunos.length,
                        onPageChange: setPage,
                        onPageSizeChange: (size) => { setPageSize(size); setPage(0); },
                    }}
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

            <ExcluirAlunoModal
                isOpen={Boolean(alunoParaExcluir)}
                alunoNome={alunoParaExcluir?.nome}
                isDeleting={isDeleting}
                onClose={() => setAlunoParaExcluir(null)}
                onConfirm={handleConfirmDelete}
            />

            <ImportarComIAModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImportarComIA}
                isLoading={isImporting}
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
