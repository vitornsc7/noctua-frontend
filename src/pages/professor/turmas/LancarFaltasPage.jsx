import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    atualizarFalta,
    buscarTurmaPorId,
    excluirFalta,
    listarFaltasPorTurma,
    registrarFalta,
} from '../../../api/turmaApi';
import { Button, DateInput, Input, Select, Tag, useToast } from '../../../components/UI';
import { PERIODICIDADE_DISPLAY, TURNO_DISPLAY, displayLabel } from '../../../utils/displayMaps';

const hojeISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const LancarFaltasPage = () => {
    const { id: turmaId } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [turma, setTurma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingFaltas, setLoadingFaltas] = useState(false);
    const [saving, setSaving] = useState(false);

    const [dataFalta, setDataFalta] = useState(hojeISO());
    const [periodo, setPeriodo] = useState('');
    const [valores, setValores] = useState({});
    const [existingMap, setExistingMap] = useState({});

    const alunos = (turma?.alunos ?? []).filter((a) => a.ativo);

    const qtdePeriodos = Number(turma?.qtdePeriodos || 4);
    const isBimestral = qtdePeriodos === 4;
    const periodoLabel = isBimestral ? 'Bimestre' : 'Trimestre';
    const periodos = Array.from({ length: qtdePeriodos }, (_, i) => i + 1);

    const carregarFaltasDaData = useCallback(
        async (data, alunosDaTurma) => {
            if (!turmaId || !data || !alunosDaTurma) return;
            setLoadingFaltas(true);
            try {
                const res = await listarFaltasPorTurma(turmaId, null, data, null, { page: 0, size: 500 });
                const faltas = res.content ?? [];

                const map = {};
                faltas.forEach((f) => { map[f.alunoId] = f; });
                setExistingMap(map);

                if (faltas.length > 0) {
                    setPeriodo(String(faltas[0].periodo));
                } else {
                    setPeriodo('');
                }

                const initValores = {};
                alunosDaTurma.forEach((aluno) => {
                    initValores[aluno.id] = map[aluno.id]
                        ? String(map[aluno.id].periodosFaltados ?? '')
                        : '';
                });
                setValores(initValores);
            } catch (err) {
                showError('Erro ao carregar faltas da data', err.message);
            } finally {
                setLoadingFaltas(false);
            }
        },
        [turmaId, showError],
    );

    useEffect(() => {
        buscarTurmaPorId(turmaId)
            .then((t) => {
                setTurma(t);
                const ativos = (t.alunos ?? []).filter((a) => a.ativo);
                carregarFaltasDaData(hojeISO(), ativos);
            })
            .catch((err) => showError('Erro ao carregar turma', err.message))
            .finally(() => setLoading(false));
    }, [turmaId, showError, carregarFaltasDaData]);

    const handleDataChange = (e) => {
        const novaData = e.target.value;
        setDataFalta(novaData);
        if (novaData) {
            carregarFaltasDaData(novaData, alunos);
        } else {
            setPeriodo('');
            setExistingMap({});
            const cleared = {};
            alunos.forEach((a) => { cleared[a.id] = ''; });
            setValores(cleared);
        }
    };

    const handleValorChange = (alunoId, value) => {
        setValores((prev) => ({ ...prev, [alunoId]: value }));
    };

    const handleSalvar = async () => {
        if (!dataFalta) {
            showError('Informe a data da falta');
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataFaltaDate = new Date(dataFalta);
        dataFaltaDate.setHours(0, 0, 0, 0);
        if (dataFaltaDate > hoje) {
            showError('Não é permitido registrar falta para uma data futura');
            return;
        }

        if (!periodo) {
            showError(`Selecione o ${periodoLabel.toLowerCase()}`);
            return;
        }

        setSaving(true);
        try {
            const operations = alunos.map((aluno) => {
                const raw = String(valores[aluno.id] ?? '').trim();
                const periodosFaltados = raw ? parseInt(raw, 10) : 0;
                const existing = existingMap[aluno.id];

                if (periodosFaltados > 0) {
                    const payload = {
                        alunoId: aluno.id,
                        periodo: Number(periodo),
                        dataFalta,
                        periodosFaltados,
                    };
                    return existing
                        ? atualizarFalta(existing.id, payload)
                        : registrarFalta(payload);
                }

                if (existing) {
                    return excluirFalta(existing.id);
                }

                return Promise.resolve();
            });

            await Promise.all(operations);
            showSuccess('Chamada salva com sucesso.', 'As faltas foram registradas.');
            navigate(`/turmas/${turmaId}`, { state: { tab: 'faltas' } });
        } catch (err) {
            showError('Erro ao salvar chamada', err.message);
        } finally {
            setSaving(false);
        }
    };

    const periodicidadeLabel = displayLabel(PERIODICIDADE_DISPLAY, turma?.qtdePeriodos);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
            </div>
        );
    }

    const inputsDisabled = !dataFalta || !periodo || loadingFaltas;

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/turmas/${turmaId}`}
                    state={{ tab: 'faltas' }}
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                    <span>Faltas</span>
                </Link>
                <h1 className="text-3xl font-semibold text-gray-700">Lançar faltas</h1>
            </div>

            {turma && (
                <div className="flex flex-wrap gap-2">
                    <Tag>{turma.anoLetivo?.slice(0, 4)}</Tag>
                    <Tag>{periodicidadeLabel}</Tag>
                    <Tag>{TURNO_DISPLAY[turma.turno] ?? turma.turno}</Tag>
                    <Tag>{alunos.length} aluno{alunos.length !== 1 ? 's' : ''}</Tag>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DateInput
                    label="Data da falta"
                    required
                    value={dataFalta}
                    onChange={handleDataChange}
                    maxDate={new Date()}
                    fullWidth
                />
                <Select
                    label={periodoLabel}
                    required
                    placeholder={`Selecione o ${periodoLabel.toLowerCase()}`}
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    disabled={!dataFalta}
                    fullWidth
                >
                    {periodos.map((p) => (
                        <Select.Option key={p} value={String(p)}>
                            {p}º {periodoLabel}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {loadingFaltas ? (
                <div className="flex items-center justify-center py-10">
                    <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
                </div>
            ) : alunos.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-sm italic text-gray-400">Nenhum aluno ativo nesta turma.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {alunos.map((aluno) => (
                        <div key={aluno.id} className="flex items-center gap-4 px-4 py-3">
                            <span className="flex-1 text-sm font-medium text-gray-700">
                                {aluno.nome}
                            </span>
                            <div className="w-40">
                                <Input
                                    placeholder="0 – 6"
                                    integerOnly
                                    min={0}
                                    max={6}
                                    step={1}
                                    value={valores[aluno.id] ?? ''}
                                    onChange={(e) => handleValorChange(aluno.id, e.target.value)}
                                    disabled={inputsDisabled}
                                    fullWidth
                                    tooltip="Períodos faltados nesta data. Deixe vazio ou 0 para nenhuma falta."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/turmas/${turmaId}`, { state: { tab: 'faltas' } })}
                    disabled={saving}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSalvar}
                    disabled={saving || loadingFaltas || alunos.length === 0}
                    isLoading={saving}
                >
                    Salvar
                </Button>
            </div>
        </div>
    );
};

export default LancarFaltasPage;
