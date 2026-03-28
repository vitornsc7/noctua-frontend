import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Select, Stepper, Table, Tag } from '../../../components/UI';
import { useToast } from '../../../components/UI/ToastContainer';
import AddAlunoModal from './components/AddAlunoModal';
import { criarTurma, criarAluno } from '../../../api/turmaApi';
import {
    ALUNO_INITIAL_VALUES,
    PERIODICIDADE_OPTIONS,
    TURMA_INITIAL_VALUES,
    TURMA_STEP_ONE_FIELDS,
    TURNO_OPTIONS,
    turmaSchema,
} from './cadastroTurmaSchema';

let nextId = 1;

const CadastroTurmaPage = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alunos, setAlunos] = useState([]);
    const [alunoModalOpen, setAlunoModalOpen] = useState(false);
    const [editingAluno, setEditingAluno] = useState(null);

    const {
        watch: watchTurma,
        setValue: setTurmaValue,
        trigger: triggerTurma,
        formState: { errors: turmaErrors },
    } = useForm({
        resolver: zodResolver(turmaSchema),
        defaultValues: TURMA_INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const turmaInfo = watchTurma();

    const handleTurmaChange = (field) => (e) => {
        const value = e.target.value;
        setTurmaValue(field, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(turmaErrors[field]),
        });
    };

    const validateStep1 = async () => {
        return triggerTurma(TURMA_STEP_ONE_FIELDS);
    };

    const openAddModal = () => {
        setEditingAluno(null);
        setAlunoModalOpen(true);
    };

    const openEditModal = (aluno) => {
        setEditingAluno(aluno);
        setAlunoModalOpen(true);
    };

    const handleDeleteAluno = (aluno) => {
        setAlunos((prev) => prev.filter((a) => a.id !== aluno.id));
    };

    const handleCloseAlunoModal = () => {
        setAlunoModalOpen(false);
    };

    const handleSaveAluno = (alunoData) => {
        if (editingAluno) {
            setAlunos((prev) =>
                prev.map((a) =>
                    a.id === editingAluno.id
                        ? { ...a, nome: alunoData.nome, observacao: alunoData.observacao }
                        : a,
                ),
            );
        } else {
            setAlunos((prev) => [
                ...prev,
                { id: nextId++, nome: alunoData.nome, observacao: alunoData.observacao },
            ]);
        }

        setAlunoModalOpen(false);
    };

    const handleNext = async () => {
        if (currentStep === 1 && !(await validateStep1())) return;
        setCurrentStep((s) => s + 1);
    };

    const handleBack = () => {
        setCurrentStep((s) => s - 1);
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        try {
            const turma = await criarTurma(turmaInfo);

            await Promise.all(
                alunos.map((aluno) => criarAluno(turma.id, aluno))
            );

            showSuccess(
                'Turma cadastrada!',
                `A turma "${turma.nome}" foi criada com sucesso.`,
            );
            navigate('/turmas');
        } catch (err) {
            showError('Erro ao cadastrar turma.', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const normalizeMediaMinima = (value) => {
        const text = String(value ?? '').trim();
        if (!text) {
            return text;
        }

        if (/^\d+$/.test(text)) {
            return `${text}.0`;
        }

        return text;
    };

    const handleTurmaBlur = (field) => () => {
        if (field === 'mediaMinima') {
            const normalized = normalizeMediaMinima(turmaInfo.mediaMinima);

            if (normalized !== turmaInfo.mediaMinima) {
                setTurmaValue('mediaMinima', normalized, {
                    shouldDirty: true,
                    shouldTouch: true,
                });
            }
        }
        triggerTurma(field);
    };

    const getTurmaFieldProps = (field) => ({
        value: turmaInfo[field] ?? '',
        onChange: handleTurmaChange(field),
        onBlur: handleTurmaBlur(field),
        error: turmaErrors[field]?.message,
    });

    const turmaOverviewFields = [
        { label: 'Periodicidade', value: turmaInfo.periodicidade },
        { label: 'Ano Letivo', value: turmaInfo.anoLetivo },
        { label: 'Turno', value: turmaInfo.turno },
        turmaInfo.qtdeAulasPrevistasPeriodo ? { label: 'Aulas por período', value: turmaInfo.qtdeAulasPrevistasPeriodo } : null,
        turmaInfo.disciplina ? { label: 'Disciplina', value: turmaInfo.disciplina } : null,
        turmaInfo.mediaMinima ? { label: 'Média Mínima', value: turmaInfo.mediaMinima } : null,
        turmaInfo.instituicao ? { label: 'Instituição', value: turmaInfo.instituicao } : null,
    ].filter(Boolean);

    const navButtons = (
        <div className="flex items-center justify-end gap-2">
            {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                    Voltar
                </Button>
            )}
            {currentStep < 3 ? (
                <Button variant="primary" onClick={handleNext}>
                    Próximo
                </Button>
            ) : (
                <Button variant="primary" onClick={handleFinish} disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Concluir'}
                </Button>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Cadastrar turma</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Preencha as informações para criar uma nova turma.
                </p>
            </div>

            <Stepper step={currentStep} showControls={false} allowStepClick={false}>
                {/* STEP 1 */}
                <Stepper.Step title="Informações">
                    <Card
                        footer={navButtons}
                        header={
                            <h2 className="text-lg font-medium text-gray-700">Informações gerais</h2>
                        }>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Input
                                label="Nome da turma"
                                required
                                placeholder="Ex: 6º Ano - 9A"
                                {...getTurmaFieldProps('nome')}
                                fullWidth
                            />

                            <Select
                                label="Periodicidade"
                                required
                                placeholder="Selecione"
                                {...getTurmaFieldProps('periodicidade')}
                                fullWidth
                            >
                                {PERIODICIDADE_OPTIONS.map((option) => (
                                    <Select.Option key={option} value={option}>{option}</Select.Option>
                                ))}
                            </Select>

                            <Input
                                label="Ano letivo"
                                required
                                placeholder="Ex: 2026"
                                {...getTurmaFieldProps('anoLetivo')}
                                integerOnly
                                maxChars={4}
                                fullWidth
                            />

                            <Select
                                label="Turno"
                                required
                                placeholder="Selecione"
                                {...getTurmaFieldProps('turno')}
                                fullWidth
                            >
                                {TURNO_OPTIONS.map((option) => (
                                    <Select.Option key={option} value={option}>{option}</Select.Option>
                                ))}
                            </Select>

                            <Input
                                label="Aulas previstas por período"
                                required
                                placeholder="Ex: 20"
                                {...getTurmaFieldProps('qtdeAulasPrevistasPeriodo')}
                                integerOnly
                                maxChars={3}
                                fullWidth
                            />

                            <Input
                                label="Média mínima"
                                required
                                placeholder="Ex: 7.0"
                                {...getTurmaFieldProps('mediaMinima')}
                                numericOnly
                                maxChars={4}
                                fullWidth
                            />

                            <Input
                                label="Disciplina"
                                placeholder="Ex: Matemática"
                                {...getTurmaFieldProps('disciplina')}
                                fullWidth
                            />

                            <Input
                                label="Instituição"
                                placeholder="Ex: Escola Estadual João da Silva"
                                {...getTurmaFieldProps('instituicao')}
                                fullWidth
                            />
                        </div>
                    </Card>
                </Stepper.Step>

                {/* STEP 2 */}
                <Stepper.Step title="Alunos">
                    <Card footer={
                        <div className='flex justify-between align-middle'>
                            <p className="text-sm text-gray-500">
                                {alunos.length}{' '}
                                {alunos.length === 1 ? 'aluno adicionado' : 'alunos adicionados'}
                            </p>
                            <div>
                                {navButtons}
                            </div>
                        </div>
                    }
                        header={
                            <div className='flex justify-between'>
                                <h2 className="text-lg font-medium text-gray-700">Adicionar alunos à turma</h2>
                                <Button variant="primary" onClick={openAddModal}>
                                    <i className="pi pi-plus text-xs" /> Adicionar aluno
                                </Button>
                            </div>}
                    >
                        <div>
                            <Table
                                data={alunos}
                                rowKey="id"
                                emptyMessage="Nenhum aluno adicionado ainda."
                                onEdit={openEditModal}
                                onDelete={handleDeleteAluno}
                                actionTooltips={{ edit: 'Editar aluno', delete: 'Remover aluno' }}
                            >
                                <Table.Column header="Nome" accessor="nome" />
                                <Table.Column
                                    header="Observação"
                                    accessor="observacao"
                                    render={(row) => (
                                        <span>
                                            {row.observacao || '--'}
                                        </span>
                                    )}
                                />
                            </Table>
                        </div>
                    </Card>
                </Stepper.Step>

                {/* STEP 3 */}
                <Stepper.Step title="Visão geral">
                    <Card footer={navButtons} header={<h2 className="text-lg font-medium text-gray-700">Informações da turma</h2>}>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm mb-2 font-normal text-gray-700">
                                    Turma: <span className="text-primary">{turmaInfo.nome}</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {turmaOverviewFields.map(({ label, value }) => (
                                        <div key={label}>
                                            <Tag className="text-sm font-medium text-gray-700">
                                                {label === 'Média Mínima' ? `Média mínima: ${value}` : label === 'Aulas por período' ? `Aulas por período: ${value}` : value}
                                            </Tag>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm mb-2 font-normal text-gray-700">
                                    Alunos <span className="text-primary">({alunos.length})</span>
                                </h3>

                                {alunos.length === 0 ? (
                                    <p className="text-sm italic text-gray-400">
                                        Nenhum aluno adicionado.
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {alunos.map((aluno) => (
                                            <li
                                                key={aluno.id}
                                                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        <i className='pi pi-user text-xs' /> {aluno.nome}
                                                    </p>
                                                    {aluno.observacao && (
                                                        <p className="text-xs text-gray-400">
                                                            {aluno.observacao}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </Card>
                </Stepper.Step>

            </Stepper>

            <AddAlunoModal
                isOpen={alunoModalOpen}
                isEditing={Boolean(editingAluno)}
                initialData={editingAluno ? {
                    nome: editingAluno.nome,
                    observacao: editingAluno.observacao,
                } : ALUNO_INITIAL_VALUES}
                onClose={handleCloseAlunoModal}
                onSave={handleSaveAluno}
            />
        </div>
    );
};

export default CadastroTurmaPage;
