import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarTurmaPorId, registrarFalta } from '../../../api/turmaApi';
import { Button, Checkbox, DateInput, Input, Select, Tag, useToast } from '../../../components/UI';
import { TURNO_DISPLAY } from '../../../utils/displayMaps';

const NovaFaltaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [turma, setTurma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        periodo: '',
        dataFalta: '',
    });

    const [busca, setBusca] = useState('');
    const [selecionados, setSelecionados] = useState([]);

    useEffect(() => {
        buscarTurmaPorId(id)
            .then(setTurma)
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoading(false));
    }, [id, showError]);

    const alunos = (turma?.alunos ?? []).filter((a) => a.ativo);

    const alunosFiltrados = busca
        ? alunos.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()))
        : alunos;

    const todosSelecionados = alunos.length > 0 && alunos.every((a) => selecionados.includes(a.id));

    const toggleAluno = (id) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleTodos = () => {
        setSelecionados(todosSelecionados ? [] : alunos.map((a) => a.id));
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSalvar = async () => {
        if (selecionados.length === 0) {
            showError('Selecione pelo menos um aluno');
            return;
        }

        try {
            setSaving(true);

            await Promise.all(
                selecionados.map((alunoId) =>
                    registrarFalta({
                        alunoId,
                        periodo: Number(form.periodo),
                        dataFalta: form.dataFalta,
                    })
                )
            );

            showSuccess('Faltas registradas com sucesso');
            navigate(`/turmas/${id}`, { state: { tab: 'faltas' } });
        } catch (err) {
            showError('Erro ao registrar faltas', err.message);
        } finally {
            setSaving(false);
        }
    };

    const isBimestral = turma?.qtdePeriodos === 4;
    const periodoLabel = isBimestral ? 'Bimestre' : 'Trimestre';

    const periodos = Array.from(
        { length: turma?.qtdePeriodos || 0 },
        (_, i) => i + 1
    );

    if (loading) {
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
                    to={`/turmas/${id}`}
                    state={{ tab: 'faltas' }}
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Faltas
                </Link>

                <h1 className="text-3xl font-semibold text-gray-700">
                    Nova falta
                </h1>
            </div>

            {turma && (
                <div className="flex flex-wrap gap-2">
                    <Tag>{turma.anoLetivo?.slice(0, 4)}</Tag>
                    <Tag>{isBimestral ? 'Bimestral' : 'Trimestral'}</Tag>
                    <Tag>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                    <Tag>{turma.alunos?.length ?? 0} alunos</Tag>
                    <Tag>
                        Média mínima:{' '}
                        {turma.mediaMinima != null
                            ? turma.mediaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
                            : '—'}
                    </Tag>
                </div>
            )}

            <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <h2 className="font-medium text-gray-700">Adicionar falta</h2>

                    <Input
                        label="Disciplina"
                        value={turma?.disciplina ?? ''}
                        disabled
                        fullWidth
                    />

                    <Input
                        label="Períodos"
                        value={turma?.qtdeAulasPrevistasPeriodo ?? ''}
                        disabled
                        fullWidth
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Select
                                label={periodoLabel}
                                value={form.periodo}
                                onChange={handleChange('periodo')}
                                fullWidth
                            >
                                {periodos.map((p) => (
                                    <Select.Option key={p} value={p}>
                                        {p}º {periodoLabel}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex-1">
                            <DateInput
                                label="Data"
                                value={form.dataFalta}
                                onChange={handleChange('dataFalta')}
                                fullWidth
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                        <h2 className="font-medium text-gray-700">Selecionar alunos</h2>
                        <span className="text-sm text-gray-500">
                            {alunos.length} alunos
                        </span>
                    </div>

                    <Input
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar aluno..."
                        leftIcon={<i className="pi pi-search" />}
                        fullWidth
                    />

                    <div className="space-y-1 max-h-72 overflow-y-auto">
                        <Checkbox
                            label="Selecionar todos"
                            checked={todosSelecionados}
                            onChange={toggleTodos}
                            variant="circle"
                            className="pb-2 border-b"
                        />

                        {alunosFiltrados.map((aluno) => (
                            <Checkbox
                                key={aluno.id}
                                label={aluno.nome}
                                checked={selecionados.includes(aluno.id)}
                                onChange={() => toggleAluno(aluno.id)}
                                variant="circle"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() =>
                        navigate(`/turmas/${id}`, { state: { tab: 'faltas' } })
                    }
                >
                    Cancelar
                </Button>

                <Button onClick={handleSalvar} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </div>
    );
};

export default NovaFaltaPage;