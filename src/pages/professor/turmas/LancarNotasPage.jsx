import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buscarAvaliacaoPorId, listarNotasPorAvaliacao, atualizarNota } from '../../../api/turmaApi';
import { Button, Checkbox, Input, Modal, useToast } from '../../../components/UI';
import { TIPO_AVALIACAO_DISPLAY, displayLabel } from '../../../utils/displayMaps';

const LancarNotasPage = () => {
    const { id: turmaId, avaliacaoId } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [avaliacao, setAvaliacao] = useState(null);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [valores, setValores] = useState({});
    const [naoRealizadas, setNaoRealizadas] = useState({});
    const [errors, setErrors] = useState({});
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        Promise.all([
            buscarAvaliacaoPorId(turmaId, avaliacaoId),
            listarNotasPorAvaliacao(turmaId, avaliacaoId),
        ])
            .then(([av, ns]) => {
                setAvaliacao(av);
                const semNota = ns.filter((n) => n.valor == null && !n.naoRealizada);
                setNotas(semNota);
                const initial = {};
                const initialNaoR = {};
                semNota.forEach((n) => { initial[n.id] = ''; initialNaoR[n.id] = false; });
                setValores(initial);
                setNaoRealizadas(initialNaoR);
            })
            .catch((err) => showError('Erro ao carregar avaliação', err.message))
            .finally(() => setLoading(false));
    }, [turmaId, avaliacaoId, showError]);

    const handleChange = (notaId, value) => {
        setValores((prev) => ({ ...prev, [notaId]: value }));
        setErrors((prev) => ({ ...prev, [notaId]: undefined }));
    };

    const handleNaoRealizadaChange = (notaId, checked) => {
        setNaoRealizadas((prev) => ({ ...prev, [notaId]: checked }));
        if (checked) {
            setValores((prev) => ({ ...prev, [notaId]: '' }));
            setErrors((prev) => ({ ...prev, [notaId]: undefined }));
        }
    };

    const save = async () => {
        setSaving(true);
        try {
            await Promise.all(
                notas.map((nota) => {
                    if (naoRealizadas[nota.id]) {
                        return atualizarNota(turmaId, avaliacaoId, nota.id, {
                            valor: 0,
                            naoRealizada: true,
                        });
                    }
                    const raw = (valores[nota.id] ?? '').trim().replace(',', '.');
                    return atualizarNota(turmaId, avaliacaoId, nota.id, {
                        valor: raw !== '' ? parseFloat(raw) : null,
                        naoRealizada: false,
                    });
                })
            );
            showSuccess('Notas lançadas com sucesso.', 'As notas foram salvas para os alunos.');
            navigate(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}`);
        } catch (err) {
            showError('Erro ao lançar notas', err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSalvar = () => {
        const algumPreenchido = notas.some((nota) => {
            if (naoRealizadas[nota.id]) return true;
            const raw = (valores[nota.id] ?? '').trim();
            return raw !== '';
        });

        if (!algumPreenchido) {
            showError('Erro ao lançar notas', 'Pelo menos uma nota deve ter valor ou estar marcada como "Não compareceu".');
            return;
        }

        const notasSemValor = notas.filter((nota) => {
            if (naoRealizadas[nota.id]) return false;
            const raw = (valores[nota.id] ?? '').trim();
            return raw === '';
        });

        if (notasSemValor.length > 0) {
            setAlertas(
                notasSemValor.map((nota) => ({
                    nome: nota.alunoNome,
                    motivo: 'sem valor informado',
                }))
            );
            setConfirmModalOpen(true);
        } else {
            save();
        }
    };

    const handleConfirmar = () => {
        setConfirmModalOpen(false);
        save();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
            </div>
        );
    }

    const tipoDisplay = avaliacao ? displayLabel(TIPO_AVALIACAO_DISPLAY, avaliacao.tipo) : '';
    const titulo = avaliacao ? `${tipoDisplay}: ${avaliacao.tema}` : '';

    return (
        <div>
            <div className="space-y-6">
                <div>
                    <Link
                        to={`/turmas/${turmaId}/avaliacoes/${avaliacaoId}`}
                        className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition focus:outline-none focus:font-bold focus:text-secondary"
                    >
                        <i className="pi pi-chevron-left text-xs" aria-hidden="true" />
                        <span>{titulo}</span>
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-700">Lançar notas</h1>
                </div>
                {notas.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <p className="text-gray-400 italic text-sm">Todos os alunos já possuem nota lançada.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                        {notas.map((nota) => (
                            <div
                                key={nota.id}
                                className="flex items-center gap-4 px-4 py-3"
                            >
                                <span className="flex-1 text-sm text-gray-700 font-medium">
                                    {nota.alunoNome}
                                </span>
                                <Checkbox
                                    label="Não compareceu"
                                    checked={naoRealizadas[nota.id] ?? false}
                                    onChange={(e) => handleNaoRealizadaChange(nota.id, e.target.checked)}
                                />
                                <div className="w-36">
                                    <Input
                                        placeholder="0 - 10"
                                        numericOnly
                                        min={0}
                                        max={10}
                                        step={0.01}
                                        value={valores[nota.id] ?? ''}
                                        onChange={(e) => handleChange(nota.id, e.target.value)}
                                        error={errors[nota.id]}
                                        fullWidth
                                        disabled={naoRealizadas[nota.id] ?? false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/turmas/${turmaId}/avaliacoes/${avaliacaoId}`)}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSalvar}
                        disabled={saving || notas.length === 0}
                        isLoading={saving}
                    >
                        Lançar notas
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title="Existem notas não preenchidas"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setConfirmModalOpen(false)} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmar} isLoading={saving} disabled={saving}>
                            Salvar
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-gray-500">
                    Deseja confirmar o lançamento mesmo assim?
                </p>
            </Modal>
        </div>
    );
};

export default LancarNotasPage;
