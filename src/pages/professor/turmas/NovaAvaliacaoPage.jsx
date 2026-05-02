import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, DateInput, Input, Select, Tag, useToast } from '../../../components/UI';
import { buscarTurmaPorId, criarAvaliacao } from '../../../api/turmaApi';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY, PERIODO_LABEL, displayLabel } from '../../../utils/displayMaps';
import { AVALIACAO_INITIAL_VALUES, TIPOS_AVALIACAO, novaAvaliacaoSchema } from './novaAvaliacaoSchema';

const NovaAvaliacaoPage = () => {
    const { id: turmaId } = useParams();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const [turma, setTurma] = useState(null);
    const [loadingTurma, setLoadingTurma] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alunosError, setAlunosError] = useState('');

    const {
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(novaAvaliacaoSchema),
        defaultValues: AVALIACAO_INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const formValues = watch();

    const [busca, setBusca] = useState('');
    const [selecionados, setSelecionados] = useState([]);

    useEffect(() => {
        buscarTurmaPorId(turmaId)
            .then((t) => {
                setTurma(t);
                if (t.qtdePeriodos) setValue('periodo', '1');
            })
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoadingTurma(false));
    }, [turmaId, showError, setValue]);

    const handleChange = (field) => (e) => {
        setValue(field, e.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(errors[field]),
        });
    };

    const alunos = (turma?.alunos ?? [])
        .filter((a) => a.ativo)
        .sort((a, b) => a.nome.localeCompare(b.nome));

    const alunosFiltrados = busca.trim()
        ? alunos.filter((a) => a.nome.toLowerCase().includes(busca.trim().toLowerCase()))
        : alunos;

    const todosSelecionados = alunos.length > 0 && alunos.every((a) => selecionados.includes(a.id));

    const toggleAluno = (alunoId) => {
        setSelecionados((prev) =>
            prev.includes(alunoId) ? prev.filter((id) => id !== alunoId) : [...prev, alunoId]
        );
        setAlunosError('');
    };

    const toggleTodos = () => {
        setSelecionados(todosSelecionados ? [] : alunos.map((a) => a.id));
        setAlunosError('');
    };

    const qtdePeriodos = turma?.qtdePeriodos ?? 2;
    const periodoLabel = PERIODO_LABEL[qtdePeriodos] ?? 'Período';
    const periodoOptions = Array.from({ length: qtdePeriodos }, (_, i) => ({
        value: String(i + 1),
        label: `${i + 1}º ${periodoLabel}`,
    }));

    const handleSalvar = async () => {
        const valid = await trigger();
        if (!valid) return;

        if (selecionados.length === 0) {
            setAlunosError('Selecione pelo menos um aluno.');
            return;
        }

        try {
            setSaving(true);
            const avaliacao = await criarAvaliacao(turmaId, {
                tipo: formValues.tipo,
                peso: formValues.peso,
                tema: formValues.tema,
                data: formValues.data,
                periodo: formValues.periodo,
                alunosIds: selecionados,
            });
            showSuccess('Avaliação criada com sucesso');
            navigate(`/turmas/${turmaId}/avaliacoes/${avaliacao.id}`);
        } catch (err) {
            showError('Erro ao criar avaliação', err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loadingTurma) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/turmas/${turmaId}`}
                    state={{ tab: 'avaliacoes' }}
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                    <span>Avaliações</span>
                </Link>
                <h1 className="text-3xl font-semibold text-gray-700">Nova avaliação</h1>
            </div>

            {turma && (
                <div className="flex flex-wrap gap-2">
                    <Tag>{typeof turma.anoLetivo === 'string' ? turma.anoLetivo.slice(0, 4) : String(turma.anoLetivo?.[0] ?? '')}</Tag>
                    <Tag>{displayLabel(PERIODICIDADE_DISPLAY, qtdePeriodos)}</Tag>
                    <Tag>{displayLabel(TURNO_DISPLAY, turma.turno)}</Tag>
                    <Tag>{turma.alunosCount ?? turma.alunos?.length ?? 0} Alunos</Tag>
                    <Tag>Média mínima: {turma.mediaMinima != null ? turma.mediaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) : '—'}</Tag>
                </div>
            )}

            <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                <div className="flex-1 min-w-72 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <h2 className="font-medium text-gray-700">Avaliação</h2>

                    <Select
                        label="Tipo da avaliação"
                        value={formValues.tipo}
                        onChange={handleChange('tipo')}
                        fullWidth
                        required
                        error={errors.tipo?.message}
                    >
                        {TIPOS_AVALIACAO.map((t) => (
                            <Select.Option key={t} value={t}>{t}</Select.Option>
                        ))}
                    </Select>

                    <Input
                        label="Peso"
                        value={formValues.peso}
                        onChange={handleChange('peso')}
                        integerOnly
                        min={1}
                        max={10}
                        required
                        fullWidth
                        error={errors.peso?.message}
                    />

                    <Input
                        label="Tema"
                        value={formValues.tema}
                        onChange={handleChange('tema')}
                        placeholder="Ex: Fotossíntese"
                        required
                        fullWidth
                        error={errors.tema?.message}
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <DateInput
                                label="Data de aplicação"
                                value={formValues.data}
                                onChange={handleChange('data')}
                                required
                                fullWidth
                                error={errors.data?.message}
                            />
                        </div>
                        <div className="flex-1">
                            <Select
                                label={periodoLabel}
                                value={formValues.periodo}
                                onChange={handleChange('periodo')}
                                fullWidth
                                required
                                error={errors.periodo?.message}
                            >
                                {periodoOptions.map((op) => (
                                    <Select.Option key={op.value} value={op.value}>
                                        {op.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-72 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium text-gray-700">Selecionar alunos</h2>
                        <span className="text-sm text-gray-500">{alunos.length} alunos na turma</span>
                    </div>
                    <Input
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar aluno..."
                        leftIcon={<i className="pi pi-search text-sm" />}
                        disabled={alunos.length === 0}
                        fullWidth
                    />

                    <div className="space-y-1 max-h-72 overflow-y-auto">
                        <Checkbox
                            label="Selecionar todos"
                            checked={todosSelecionados}
                            onChange={toggleTodos}
                            disabled={alunos.length === 0}
                            variant="circle"
                            className="px-2 pb-3 font-medium border-b border-gray-200"
                        />

                        {alunosFiltrados.map((aluno) => (
                            <Checkbox
                                key={aluno.id}
                                label={aluno.nome}
                                checked={selecionados.includes(aluno.id)}
                                onChange={() => toggleAluno(aluno.id)}
                                variant="circle"
                                className="px-2 py-1"
                            />
                        ))}

                        {alunosFiltrados.length === 0 && (
                            <p className="text-sm text-gray-400 italic px-2 py-2">Nenhum aluno encontrado.</p>
                        )}
                    </div>

                    {alunosError && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                            <i className="pi pi-exclamation-circle" aria-hidden="true" />
                            {alunosError}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/turmas/${turmaId}`, { state: { tab: 'avaliacoes' } })}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSalvar}
                    disabled={saving}
                >
                    {saving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </div>
    );
};

export default NovaAvaliacaoPage;
