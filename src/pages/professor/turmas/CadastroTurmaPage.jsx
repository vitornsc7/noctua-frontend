import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stepper } from '../../../components/UI';
import { useToast } from '../../../components/UI/ToastContainer';
import {
    buscarTurmaPorId,
    criarTurma,
    criarAluno,
    atualizarTurmaComFormData,
} from '../../../api/turmaApi';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY } from '../../../utils/displayMaps';
import {
    TURMA_INITIAL_VALUES,
    TURMA_STEP_ONE_FIELDS,
    turmaSchema,
} from './cadastroTurmaSchema';
import InformacoesStep from './steps/InformacoesStep';
import AlunosStep from './steps/AlunosStep';
import VisaoGeralStep from './steps/VisaoGeralStep';

const getAnoLetivo = (anoLetivo) => {
    if (!anoLetivo) return String(new Date().getFullYear());
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0] ?? new Date().getFullYear());
    return String(anoLetivo).slice(0, 4);
};

const mapTurmaToFormValues = (turma) => ({
    nome: turma?.nome ?? '',
    periodicidade: PERIODICIDADE_DISPLAY[turma?.qtdePeriodos] ?? '',
    anoLetivo: getAnoLetivo(turma?.anoLetivo),
    turno: TURNO_DISPLAY[turma?.turno] ?? '',
    disciplina: turma?.disciplina ?? '',
    mediaMinima: turma?.mediaMinima != null ? String(turma.mediaMinima) : TURMA_INITIAL_VALUES.mediaMinima,
    qtdeAulasPrevistasPeriodo:
        turma?.qtdeAulasPrevistasPeriodo != null ? String(turma.qtdeAulasPrevistasPeriodo) : '',
    instituicao: turma?.instituicao ?? '',
});

const CadastroTurmaPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sourceTurmaId = searchParams.get('from');
    const isCopyMode = Boolean(sourceTurmaId);
    const { showSuccess, showError } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [createdTurmaId, setCreatedTurmaId] = useState(null);
    const [isSubmittingStep1, setIsSubmittingStep1] = useState(false);
    const [isCloningTurma, setIsCloningTurma] = useState(isCopyMode);
    const [alunos, setAlunos] = useState([]);

    const {
        watch: watchTurma,
        reset: resetTurma,
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

    useEffect(() => {
        if (!sourceTurmaId) {
            setIsCloningTurma(false);
            resetTurma(TURMA_INITIAL_VALUES);
            setAlunos([]);
            return;
        }

        setIsCloningTurma(true);

        buscarTurmaPorId(sourceTurmaId)
            .then((turma) => {
                resetTurma(mapTurmaToFormValues(turma));
                setAlunos(
                    (turma.alunos ?? [])
                        .filter((aluno) => aluno.ativo !== false)
                        .map((aluno) => ({
                            nome: aluno.nome,
                            observacao: aluno.observacao ?? '',
                        })),
                );
                setCurrentStep(1);
            })
            .catch((err) => {
                showError('Erro ao copiar turma', err.message);
                navigate('/turmas');
            })
            .finally(() => setIsCloningTurma(false));
    }, [navigate, resetTurma, showError, sourceTurmaId]);

    const handleTurmaChange = (field) => (e) => {
        setTurmaValue(field, e.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(turmaErrors[field]),
        });
    };

    const normalizeMediaMinima = (value) => {
        const text = String(value ?? '').trim();
        if (!text) return text;
        if (/^\d+$/.test(text)) return `${text}.0`;
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
        isLoading: isCloningTurma,
    });

    const handleStep1Submit = async () => {
        const valid = await triggerTurma(TURMA_STEP_ONE_FIELDS);
        if (!valid) return;

        setIsSubmittingStep1(true);
        try {
            if (createdTurmaId) {
                await atualizarTurmaComFormData(createdTurmaId, turmaInfo);
            } else {
                const turma = await criarTurma(turmaInfo);
                setCreatedTurmaId(turma.id);

                if (alunos.length > 0) {
                    const created = await Promise.all(
                        alunos.map((a) => criarAluno(turma.id, a)),
                    );
                    setAlunos(
                        created.map((c) => ({
                            id: c.id,
                            nome: c.nome,
                            observacao: c.observacao ?? '',
                        })),
                    );
                }
            }
            setCurrentStep(2);
        } catch (err) {
            showError('Erro ao salvar turma.', err.message);
        } finally {
            setIsSubmittingStep1(false);
        }
    };

    const handleStep2Next = () => setCurrentStep(3);
    const handleStep2Back = () => setCurrentStep(1);

    const handleFinish = () => {
        navigate(`/turmas/${createdTurmaId}`, {
            state: {
                toast: {
                    variant: 'success',
                    message: 'Turma cadastrada!',
                    description: `A turma "${turmaInfo.nome}" foi criada com sucesso.`,
                },
            },
        });
    };

    const handleStep3Back = () => setCurrentStep(2);

    const turmaOverviewFields = [
        { label: 'Periodicidade', value: turmaInfo.periodicidade },
        { label: 'Ano Letivo', value: turmaInfo.anoLetivo },
        { label: 'Turno', value: turmaInfo.turno },
        turmaInfo.qtdeAulasPrevistasPeriodo
            ? { label: 'Aulas por período', value: turmaInfo.qtdeAulasPrevistasPeriodo }
            : null,
        turmaInfo.disciplina ? { label: 'Disciplina', value: turmaInfo.disciplina } : null,
        turmaInfo.mediaMinima ? { label: 'Média Mínima', value: turmaInfo.mediaMinima } : null,
        turmaInfo.instituicao ? { label: 'Instituição', value: turmaInfo.instituicao } : null,
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isCopyMode ? 'Nova turma a partir da atual' : 'Cadastrar turma'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {isCopyMode
                        ? 'Os dados da turma de origem foram copiados para você ajustar apenas o que for necessário.'
                        : 'Preencha as informações para criar uma nova turma.'}
                </p>
            </div>

            <Stepper step={currentStep} showControls={false} allowStepClick={false}>
                <Stepper.Step title="Informações">
                    <InformacoesStep
                        getTurmaFieldProps={getTurmaFieldProps}
                        isCloningTurma={isCloningTurma}
                        isSubmitting={isSubmittingStep1}
                        isEditing={Boolean(createdTurmaId)}
                        onSubmit={handleStep1Submit}
                    />
                </Stepper.Step>

                <Stepper.Step title="Alunos">
                    {createdTurmaId && (
                        <AlunosStep
                            turmaId={createdTurmaId}
                            initialAlunos={alunos}
                            onChange={setAlunos}
                            onNext={handleStep2Next}
                            onBack={handleStep2Back}
                            showError={showError}
                        />
                    )}
                </Stepper.Step>

                <Stepper.Step title="Visão geral">
                    <VisaoGeralStep
                        turmaInfo={turmaInfo}
                        turmaOverviewFields={turmaOverviewFields}
                        alunos={alunos}
                        onBack={handleStep3Back}
                        onFinish={handleFinish}
                    />
                </Stepper.Step>
            </Stepper>
        </div>
    );
};

export default CadastroTurmaPage;

