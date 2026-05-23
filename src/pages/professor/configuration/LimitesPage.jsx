import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, useToast } from '../../../components/UI';
import { getLimites, atualizarLimites } from '../../../api/professorApi';

const DEFAULTS = {
    atencaoFim: 79.9,
    regularFim: 89.9,
    pontosAcima: 2,
    pontosAbaixo: 1,
};

const COLORS = {
    red: { border: 'border-t-red-400', label: 'text-red-700' },
    orange: { border: 'border-t-orange-400', label: 'text-orange-700' },
    yellow: { border: 'border-t-yellow-400', label: 'text-yellow-700' },
    green: { border: 'border-t-green-400', label: 'text-green-700' },
};

const RangeValue = ({ value, disabled, onChange, error }) => (
    <Input
        value={String(value)}
        onChange={onChange}
        disabled={disabled}
        numericOnly
        maxIntegerDigits={3}
        maxDecimalDigits={1}
        step={0.1}
        fullWidth
        rightIcon={'%'}
        error={error || undefined}
    />
);

const CategoryCard = ({ color, title, minVal, maxVal, suffix = '%', onMaxChange, maxError, minFixed = true, maxFixed = false }) => {
    const c = COLORS[color];
    return (
        <div className={`rounded-xl border border-gray-200 border-t-4 ${c.border} bg-white p-5`}>
            <p className={`mb-4 text-sm font-semibold ${c.label}`}>{title}</p>
            <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                    <RangeValue value={minVal} suffix={suffix} disabled={minFixed} />
                </div>
                <span className="mt-2 shrink-0 text-sm text-gray-400">a</span>
                <div className="min-w-0 flex-1">
                    <RangeValue
                        value={maxVal}
                        suffix={suffix}
                        disabled={maxFixed}
                        onChange={onMaxChange}
                        error={maxError}
                    />
                    {maxError && <p className="mt-1 text-xs text-red-500">{maxError}</p>}
                </div>
            </div>
        </div>
    );
};

const NotaCard = ({ color, title, description }) => {
    const c = COLORS[color];
    return (
        <div className={`rounded-xl border border-gray-200 border-t-4 ${c.border} bg-white p-5`}>
            <p className={`mb-1 text-sm font-semibold ${c.label}`}>{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
};

const LimitesPage = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [atencaoFim, setAtencaoFim] = useState(String(DEFAULTS.atencaoFim));
    const [regularFim, setRegularFim] = useState(String(DEFAULTS.regularFim));
    const [pontosAcima, setPontosAcima] = useState(String(DEFAULTS.pontosAcima));
    const [pontosAbaixo, setPontosAbaixo] = useState(String(DEFAULTS.pontosAbaixo));
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getLimites()
            .then((data) => {
                setAtencaoFim(String(data.atencaoFim ?? DEFAULTS.atencaoFim));
                setRegularFim(String(data.regularFim ?? DEFAULTS.regularFim));
                setPontosAcima(String(data.pontosAcima ?? DEFAULTS.pontosAcima));
                setPontosAbaixo(String(data.pontosAbaixo ?? DEFAULTS.pontosAbaixo));
            })
            .catch(() => showError('Erro ao carregar', 'Não foi possível carregar os limites.'))
            .finally(() => setLoading(false));
    }, []);

    const parseVal = (v) => parseFloat(String(v).replace(',', '.'));

    const validate = () => {
        const errs = {};
        const af = parseVal(atencaoFim);
        const rf = parseVal(regularFim);
        const pa = parseVal(pontosAcima);

        if (isNaN(af) || af <= 75 || af >= 100) {
            errs.atencaoFim = 'Deve ser entre 75,1 e 99,9';
        }
        if (isNaN(rf) || rf <= af || rf >= 100) {
            errs.regularFim = `Deve ser entre ${atencaoFim} e 99,9`;
        }
        if (isNaN(pa) || pa <= 0) {
            errs.pontosAcima = 'Deve ser maior que 0';
        }
        const pb = parseVal(pontosAbaixo);
        if (isNaN(pb) || pb <= 0) {
            errs.pontosAbaixo = 'Deve ser maior que 0';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSalvar = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await atualizarLimites({
                atencaoFim: parseVal(atencaoFim),
                regularFim: parseVal(regularFim),
                pontosAcima: parseVal(pontosAcima),
                pontosAbaixo: parseVal(pontosAbaixo),
            });
            showSuccess('Limites salvos', 'As configurações foram atualizadas com sucesso.');
        } catch {
            showError('Erro ao salvar', 'Não foi possível salvar as configurações.');
        } finally {
            setSaving(false);
        }
    };

    const af = parseVal(atencaoFim);
    const rf = parseVal(regularFim);
    const atencaoInicio = 75;
    const regularInicio = isNaN(af) ? '-' : +(af + 0.1).toFixed(1);
    const altaInicio = isNaN(rf) ? '-' : +(rf + 0.1).toFixed(1);

    if (loading) return (
        <div className="flex items-center justify-center py-24">
            <i className="pi pi-spin pi-spinner text-2xl text-gray-400" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/configuracoes"
                    className="mb-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                    <span>Configurações</span>
                </Link>
                <h1 className="text-3xl font-semibold text-gray-700">Configuração de limites</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Defina os intervalos de classificação de frequência e desempenho dos alunos.
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Frequência</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        A categoria <span className="font-medium text-gray-700">Crítica</span> é fixada em 75%. Ajuste os limites superiores das demais categorias.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <CategoryCard
                        color="red"
                        title="Crítica"
                        minVal="0"
                        maxVal="74,9"
                        minFixed
                        maxFixed
                    />
                    <CategoryCard
                        color="orange"
                        title="Baixa"
                        minVal={atencaoInicio}
                        maxVal={atencaoFim}
                        minFixed
                        maxFixed={false}
                        onMaxChange={(e) => { setAtencaoFim(e.target.value); setErrors((prev) => ({ ...prev, atencaoFim: undefined })); }}
                        maxError={errors.atencaoFim}
                    />
                    <CategoryCard
                        color="yellow"
                        title="Média"
                        minVal={regularInicio}
                        maxVal={regularFim}
                        minFixed
                        maxFixed={false}
                        onMaxChange={(e) => { setRegularFim(e.target.value); setErrors((prev) => ({ ...prev, regularFim: undefined })); }}
                        maxError={errors.regularFim}
                    />
                    <CategoryCard
                        color="green"
                        title="Alta"
                        minVal={altaInicio}
                        maxVal="100"
                        minFixed
                        maxFixed
                    />
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Desempenho</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Classifica o desempenho do aluno com base na distância em relação à média mínima da turma.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className={`rounded-xl border border-gray-200 border-t-4 border-t-green-400 bg-white p-5`}>
                        <p className="mb-3 text-sm font-semibold text-green-700">Alto</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="shrink-0">Acima de</span>
                            <div className="w-24 shrink-0">
                                <Input
                                    value={pontosAcima}
                                    onChange={(e) => { setPontosAcima(e.target.value); setErrors((prev) => ({ ...prev, pontosAcima: undefined })); }}
                                    numericOnly
                                    maxIntegerDigits={2}
                                    maxDecimalDigits={1}
                                    step={0.1}
                                    fullWidth
                                    rightIcon={<span className="text-xs text-gray-400">pts</span>}
                                    error={errors.pontosAcima ? ' ' : undefined}
                                />
                            </div>
                            <span className="shrink-0">da média mínima</span>
                        </div>
                        {errors.pontosAcima && (
                            <p className="mt-1 text-xs text-red-500">{errors.pontosAcima}</p>
                        )}
                    </div>

                    <div className={`rounded-xl border border-gray-200 border-t-4 border-t-yellow-400 bg-white p-5`}>
                        <p className="mb-3 text-sm font-semibold text-yellow-700">Médio</p>
                        <p className="text-sm text-gray-500">
                            Entre{' '}
                            <span className="font-medium text-gray-700">{pontosAbaixo || '—'} abaixo</span>
                            {' '}e{' '}
                            <span className="font-medium text-gray-700">{pontosAcima || '—'} acima</span>
                            {' '}da média mínima.
                        </p>
                    </div>

                    <div className={`rounded-xl border border-gray-200 border-t-4 border-t-red-400 bg-white p-5`}>
                        <p className="mb-3 text-sm font-semibold text-red-700">Baixo</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="shrink-0">Abaixo de</span>
                            <div className="w-24 shrink-0">
                                <Input
                                    value={pontosAbaixo}
                                    onChange={(e) => { setPontosAbaixo(e.target.value); setErrors((prev) => ({ ...prev, pontosAbaixo: undefined })); }}
                                    numericOnly
                                    maxIntegerDigits={2}
                                    maxDecimalDigits={1}
                                    step={0.1}
                                    fullWidth
                                    rightIcon={<span className="text-xs text-gray-400">pts</span>}
                                    error={errors.pontosAbaixo ? ' ' : undefined}
                                />
                            </div>
                            <span className="shrink-0">da média mínima</span>
                        </div>
                        {errors.pontosAbaixo && (
                            <p className="mt-1 text-xs text-red-500">{errors.pontosAbaixo}</p>
                        )}
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-2 border-t border-gray-100 pt-2">
                <Button variant="outline" onClick={() => navigate('/configuracoes')}>
                    Cancelar
                </Button>
                <Button onClick={handleSalvar} isLoading={saving}>
                    Salvar
                </Button>
            </div>
        </div>
    );
};

export default LimitesPage;
