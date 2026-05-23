import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarTurmaPorId, registrarFalta } from '../../../api/turmaApi';
import { Button, Checkbox, DateInput, Input, Select, Tag, useToast } from '../../../components/UI';
import { TURNO_DISPLAY, PERIODICIDADE_DISPLAY, displayLabel } from '../../../utils/displayMaps';

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
        periodosFaltados: 1,
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

    const handlePeriodosFaltadosChange = (e) => {
        setForm((prev) => ({ ...prev, periodosFaltados: e.target.value }));
    };

    const qtdePeriodos = Number(turma?.qtdePeriodos || 0);

    const periodicidadeLabel =
        displayLabel(PERIODICIDADE_DISPLAY, turma?.qtdePeriodos) ??
        `${qtdePeriodos} períodos`;

    const isBimestral = periodicidadeLabel === 'Bimestral' || qtdePeriodos === 4;
    const totalPeriodos = isBimestral ? 4 : 3;
    const periodoLabel = isBimestral ? 'Bimestre' : 'Trimestre';

    const periodos = Array.from(
        { length: totalPeriodos },
        (_, i) => i + 1
    );

    const handleSalvar = async () => {
        if (!form.dataFalta) {
            showError('Informe a data da falta');
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const dataFalta = new Date(form.dataFalta);
        dataFalta.setHours(0, 0, 0, 0);

        if (dataFalta > hoje) {
            showError('Não é permitido registrar falta para uma data futura');
            return;
        }

        if (!form.periodo) {
            showError(`Selecione o ${periodoLabel.toLowerCase()}`);
            return;
        }

        if (Number(form.periodosFaltados) < 1 || Number(form.periodosFaltados) > 6) {
            showError('Informe uma quantidade de períodos faltados entre 1 e 6');
            return;
        }

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
                        periodosFaltados: Number(form.periodosFaltados),
                    })
                )
            );

            showSuccess('Falta(s) registrada(s) com sucesso', 'As faltas foram adicionadas aos alunos selecionados.');
            navigate(`/turmas/${id}`, { state: { tab: 'faltas' } });
        } catch (err) {
            showError('Erro ao registrar faltas', err.message);
        } finally {
            setSaving(false);
        }
    };

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
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                    <span>Faltas</span>
                </Link>

                <h1 className="text-3xl font-semibold text-gray-700">
                    Nova falta
                </h1>
            </div>

            {turma && (
                <div className="flex flex-wrap gap-2">
                    <Tag>{turma.anoLetivo?.slice(0, 4)}</Tag>
                    <Tag>{periodicidadeLabel}</Tag>
                    <Tag>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                    <Tag>{turma.alunos?.length ?? 0} alunos</Tag>
                    <Tag>
                        Média mínima:{' '}
                        {turma.mediaMinima != null
                            ? turma.mediaMinima.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
                            : '-'}
                    </Tag>
                </div>
            )}

            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <div className="flex-1 min-w-72 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <h2 className="font-medium text-gray-700">Adicionar falta</h2>

                    <DateInput
                        required
                        label="Data"
                        value={form.dataFalta}
                        onChange={handleChange('dataFalta')}
                        fullWidth
                    />

                    <Select
                        required
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

                    <Input
                        required
                        label="Períodos faltados"
                        integerOnly
                        min={1}
                        max={6}
                        value={form.periodosFaltados}
                        onChange={handlePeriodosFaltadosChange}
                        fullWidth
                        tooltip="Informe a quantidade de aulas que o aluno perdeu nesta data."
                    />
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
                            <div key={aluno.id} className="flex items-center">
                                <Checkbox
                                    label={aluno.nome}
                                    checked={selecionados.includes(aluno.id)}
                                    onChange={() => toggleAluno(aluno.id)}
                                    variant="circle"
                                    className="px-2 py-1 flex-1"
                                />
                            </div>
                        ))}

                        {alunosFiltrados.length === 0 && (
                            <p className="text-sm text-gray-400 italic px-2 py-2">Nenhum aluno encontrado.</p>
                        )}
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

                <Button onClick={handleSalvar} disabled={saving} isLoading={saving}>
                    Salvar
                </Button>
            </div>
        </div>
    );
};

export default NovaFaltaPage;