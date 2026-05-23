import React, { useEffect, useState } from 'react';
import { getLimites } from '../../../../api/professorApi';
import {
    calcularMediaPonderadaTurma,
    listarAlunos,
    listarAvaliacoes,
    listarFaltasPorTurma,
    listarTodasNotasPorTurma,
} from '../../../../api/turmaApi';
import { Table, Tabs, Tooltip, useToast } from '../../../../components/UI';
import { TIPO_AVALIACAO_DISPLAY, displayLabel } from '../../../../utils/displayMaps';
import { INTERVENCAO_CARD_COLORS, INTERVENCAO_ICON, INTERVENCAO_TEXT_COLOR, INTERVENCOES, fmtN, freqLabel, gradeLabel, getIntervencao } from '../../../../utils/intervencaoUtils';

const DesempenhoTab = ({ turma }) => {
    const { showError } = useToast();

    const [alunos, setAlunos] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [notasPorAvaliacao, setNotasPorAvaliacao] = useState({});
    const [faltas, setFaltas] = useState([]);
    const [mediaPonderadaData, setMediaPonderadaData] = useState(null);
    const [limites, setLimites] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!turma?.id) return;
        setLoading(true);

        Promise.all([
            listarAlunos(turma.id, { ativo: true, page: 0, size: 100 }),
            listarAvaliacoes(turma.id, null, null, null, { page: 0, size: 200 }),
            listarFaltasPorTurma(turma.id),
            calcularMediaPonderadaTurma(turma.id),
            getLimites(),
            listarTodasNotasPorTurma(turma.id),
        ])
            .then(([alunosData, avaliacoesData, faltasData, mpData, limitesData, todasNotas]) => {
                setAlunos(alunosData.content ?? []);
                setAvaliacoes(avaliacoesData.content ?? []);
                setFaltas(Array.isArray(faltasData) ? faltasData : (faltasData?.content ?? []));
                setMediaPonderadaData(mpData);
                setLimites(limitesData);

                const map = {};
                todasNotas.forEach((nota) => {
                    if (!map[nota.avaliacaoId]) map[nota.avaliacaoId] = [];
                    map[nota.avaliacaoId].push(nota);
                });
                setNotasPorAvaliacao(map);
            })
            .catch((err) => showError('Erro ao carregar notas', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id]);

    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);
    const isTrimestral = qtdePeriodosTurma === 3;
    const qtdePeriodos = isTrimestral ? 3 : 4;
    const periodoLabel = isTrimestral ? 'Trimestre' : 'Bimestre';

    const rootAvaliacoes = avaliacoes.filter((av) => av.avaliacaoPaiId == null);

    const filhaIdMap = {};
    rootAvaliacoes.forEach((av) => {
        if (av.avaliacaoFilhaId) filhaIdMap[av.id] = av.avaliacaoFilhaId;
    });

    const avaliacoesPorPeriodo = {};
    for (let p = 1; p <= qtdePeriodos; p++) {
        avaliacoesPorPeriodo[p] = rootAvaliacoes
            .filter((av) => Number(av.periodo) === p)
            .sort((a, b) => {
                const da = a.dataAplicacao ? new Date(a.dataAplicacao) : new Date(0);
                const db = b.dataAplicacao ? new Date(b.dataAplicacao) : new Date(0);
                return da - db || a.id - b.id;
            });
    }

    const periodosComAvaliacoes = Array.from({ length: qtdePeriodos }, (_, i) => i + 1).filter(
        (p) => avaliacoesPorPeriodo[p]?.length > 0
    );

    const getNotaAluno = (alunoId, rootAvaliacaoId) => {
        const notas = notasPorAvaliacao[rootAvaliacaoId] ?? [];
        const nota = notas.find(
            (n) => Number(n.alunoId ?? n.aluno?.id) === Number(alunoId)
        );

        if (!nota) return { valor: null, naoRealizada: false, isSegundaChamada: false };

        if (nota.naoRealizada) {
            const filhaId = filhaIdMap[rootAvaliacaoId];
            if (filhaId) {
                const notasFilha = notasPorAvaliacao[filhaId] ?? [];
                const notaFilha = notasFilha.find(
                    (n) => Number(n.alunoId ?? n.aluno?.id) === Number(alunoId)
                );
                if (notaFilha?.valor != null) {
                    return { valor: notaFilha.valor, naoRealizada: false, isSegundaChamada: true };
                }
            }
            return { valor: nota.valor ?? null, naoRealizada: true, isSegundaChamada: false };
        }

        if (nota.valor != null) {
            return { valor: nota.valor, naoRealizada: false, isSegundaChamada: false };
        }

        return { valor: null, naoRealizada: false, isSegundaChamada: false };
    };

    const calcularFrequenciaAluno = (alunoId, periodo) => {
        const aulasPrevistas = Number(turma?.qtdeAulasPrevistasPeriodo) || 0;
        if (aulasPrevistas <= 0) return null;
        const totalFaltas = faltas
            .filter((f) => {
                const fId = f.alunoId ?? f.aluno?.id;
                return Number(fId) === Number(alunoId) && Number(f.periodo) === Number(periodo);
            })
            .reduce((total, f) => total + Number(f.periodosFaltados ?? 1), 0);
        return Math.max(0, Number((((aulasPrevistas - totalFaltas) / aulasPrevistas) * 100).toFixed(1)));
    };

    const getMediaAlunoPeriodo = (alunoId, periodo) => {
        const m = mediaPonderadaData?.mediasAlunos?.find((a) => a.alunoId === alunoId);
        const val = m?.mediaPorPeriodo?.[periodo];
        return val != null ? Number(val) : null;
    };

    const fmtNota = (n) =>
        n != null
            ? Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '—';

    const fmtFreq = (n) => (n != null ? `${String(n).replace('.', ',')}%` : '—');

    const tipoLabel = (tipo) => displayLabel(TIPO_AVALIACAO_DISPLAY, tipo);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" aria-hidden="true" />
            </div>
        );
    }

    if (periodosComAvaliacoes.length === 0 || alunos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-gray-500">
                    {alunos.length === 0
                        ? 'Nenhum aluno cadastrado na turma.'
                        : 'Nenhuma avaliação registrada ainda.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700">
                    Desempenho por {periodoLabel.toLowerCase()}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Notas por avaliação, frequência e sugestão de intervenção para cada aluno.
                </p>
            </div>
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Tipos de intervenção</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Classificação automática baseada na média e frequência dos alunos.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
                    {INTERVENCOES.map((item) => {
                        const c = INTERVENCAO_CARD_COLORS[item.color];
                        return (
                            <div
                                key={item.titulo}
                                className={`rounded-xl border border-gray-200 border-t-4 ${c.border} bg-white p-5`}
                            >
                                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${c.label}`}>
                                    <i className={item.icon} aria-hidden="true" />
                                    <span>{item.titulo}</span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-500">{item.descricao}</p>
                                {limites && (
                                    <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                                        {item.condicoes.map(([f, g]) => (
                                            <p key={`${f}|${g}`} className="text-xs text-gray-400">
                                                {freqLabel(f, limites)} · {gradeLabel(g, limites)}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <Tabs defaultTab={String(periodosComAvaliacoes[0])}>
                {periodosComAvaliacoes.map((periodoNum) => {
                    const avs = avaliacoesPorPeriodo[periodoNum];

                    return (
                        <Tabs.Tab
                            key={String(periodoNum)}
                            id={String(periodoNum)}
                            label={`${periodoNum}º ${periodoLabel}`}
                        >
                            <Table
                                data={alunos}
                                rowKey="id"
                                emptyMessage="Nenhum aluno cadastrado."
                            >
                                <Table.Column
                                    header="Aluno"
                                    accessor="nome"
                                />
                                {avs.map((av, idx) => (
                                    <Table.Column
                                        key={String(av.id)}
                                        id={String(av.id)}
                                        headerClassName="text-center"
                                        header={
                                            <div>
                                                <Tooltip className="cursor-default" content={`${displayLabel(TIPO_AVALIACAO_DISPLAY, av.tipo)} · ${av.tema}`}>
                                                    AV{idx + 1}
                                                    {av.peso !== 1 && (
                                                        <span className="ml-1 text-gray-700">(P{av.peso})</span>
                                                    )}
                                                </Tooltip>
                                            </div>
                                        }
                                        className="text-center"
                                        render={(aluno) => {
                                            const { valor, naoRealizada, isSegundaChamada } =
                                                getNotaAluno(aluno.id, av.id);
                                            if (valor != null) {
                                                return (
                                                    <span
                                                        className={
                                                            naoRealizada
                                                                ? 'text-gray-400'
                                                                : isSegundaChamada
                                                                    ? 'text-gray-600'
                                                                    : 'text-gray-800'
                                                        }
                                                    >
                                                        {fmtNota(valor)}
                                                        {isSegundaChamada && (
                                                            <span className="ml-1 text-[10px] text-gray-400">
                                                                2ª
                                                            </span>
                                                        )}
                                                    </span>
                                                );
                                            }
                                            return <span className="text-gray-300">-</span>;
                                        }}
                                    />
                                ))}
                                <Table.Column
                                    header="Média"
                                    headerClassName="text-center"
                                    className="text-center border-l"
                                    render={(aluno) => {
                                        const media = getMediaAlunoPeriodo(aluno.id, periodoNum);
                                        return media != null ? (
                                            <span className="text-gray-800">
                                                {Number(media).toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        ) : (
                                            '—'
                                        );
                                    }}
                                />
                                <Table.Column
                                    header="Freq."
                                    headerClassName="text-center"
                                    className="text-center"
                                    render={(aluno) =>
                                        fmtFreq(calcularFrequenciaAluno(aluno.id, periodoNum))
                                    }
                                />
                                {limites && (
                                    <Table.Column
                                        header="Sugestão"
                                        headerClassName="text-center"
                                        className="text-center"
                                        render={(aluno) => {
                                            const freq = calcularFrequenciaAluno(aluno.id, periodoNum);
                                            const media = getMediaAlunoPeriodo(aluno.id, periodoNum);
                                            const intervencao = getIntervencao(media, freq, limites, turma?.mediaMinima);
                                            return intervencao ? (
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium ${INTERVENCAO_TEXT_COLOR[intervencao] ?? 'text-gray-500'}`}>
                                                    <i className={INTERVENCAO_ICON[intervencao]} aria-hidden="true" />
                                                    {intervencao}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-300">—</span>
                                            );
                                        }}
                                    />
                                )}
                            </Table>
                        </Tabs.Tab>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default DesempenhoTab;
