import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLimites } from '../../../../api/professorApi';
import {
    calcularMediaPonderadaTurma,
    listarAlunos,
    listarAvaliacoes,
    listarFaltasPorTurma,
    listarTodasNotasPorTurma,
} from '../../../../api/turmaApi';
import { Button, Tabs, useToast } from '../../../../components/UI';
import AnualTab from './visaoGeral/AnualTab';
import PeriodoTab from './visaoGeral/PeriodoTab';

import { INTERVENCAO_CARD_COLORS, INTERVENCOES, fmtN, freqLabel, gradeLabel } from '../../../../utils/intervencaoUtils';

const VisaoGeralTab = ({ turma }) => {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [notasPorAvaliacao, setNotasPorAvaliacao] = useState({});
    const [faltas, setFaltas] = useState([]);
    const [mediaPonderadaData, setMediaPonderadaData] = useState(null);
    const [limites, setLimites] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

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
            .catch((err) => showError('Erro ao carregar visão geral', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, showError]);

    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);
    const isTrimestral = qtdePeriodosTurma === 3;
    const qtdePeriodos = isTrimestral ? 3 : 4;
    const periodoLabel = isTrimestral ? 'Trimestre' : 'Bimestre';

    const periodos = Array.from({ length: qtdePeriodos }, (_, index) => {
        const numero = index + 1;

        return {
            numero,
            titulo: `${numero}º ${periodoLabel}`,
        };
    });

    const periodosVisiveis = periodos.filter((periodo) => {
        return true;
    });

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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" aria-hidden="true"></i>
            </div>
        );
    }

    const temAvaliacao = avaliacoes.length > 0;
    const temDadosAvaliacao = mediaPonderadaData?.resumoPorPeriodo != null &&
        Object.values(mediaPonderadaData.resumoPorPeriodo).some(
            (r) => r?.mediaProva != null || r?.mediaTrabalho != null || r?.mediaAtividade != null
        );
    const temDadosFalta = faltas.length > 0;
    const semDados = !loading && !temAvaliacao && !temDadosAvaliacao && !temDadosFalta;

    if (semDados) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex gap-3">
                    <i className="pi pi-chart-bar text-lg text-gray-700" aria-hidden="true"></i>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Nenhum dado registrado ainda
                    </h3>
                </div>


                <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Registre avaliações e faltas para visualizar o resumo e o boletim progressivo da turma.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                    <Button onClick={() => navigate(`/turmas/${turma.id}/avaliacoes/nova`)}>
                        <i className="pi pi-plus text-xs" aria-hidden="true"></i>
                        Nova avaliação
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/turmas/${turma.id}/faltas/nova`)}>
                        <i className="pi pi-plus text-xs" aria-hidden="true"></i>
                        Nova falta
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* <div>
                <h2 className="text-lg font-semibold text-gray-700">Visão geral da turma</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Tenha uma visão geral do desempenho da turma em cada período letivo.
                </p>
            </div> */}
            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Tipos de intervenção</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Classificação automática baseada na média final e frequência total dos alunos.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
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
                                {/* {limites && (
                                    <div className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                                        {item.condicoes.map(([f, g]) => (
                                            <p key={`${f}|${g}`} className="text-xs text-gray-400">
                                                {freqLabel(f, limites)} · {gradeLabel(g, limites)}
                                            </p>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        );
                    })}
                </div>
            </section>
            <Tabs defaultTab="anual">
                <Tabs.Tab id="anual" label="Anual">
                    <AnualTab
                        alunos={alunos}
                        faltas={faltas}
                        turma={turma}
                        mediasAlunos={mediaPonderadaData?.mediasAlunos ?? []}
                        limites={limites}
                    />
                </Tabs.Tab>
                {periodosVisiveis.map((periodo) => (
                    <Tabs.Tab key={periodo.numero} id={String(periodo.numero)} label={periodo.titulo}>
                        <PeriodoTab
                            periodo={periodo}
                            alunos={alunos}
                            avaliacoes={avaliacoesPorPeriodo[periodo.numero] ?? []}
                            notasPorAvaliacao={notasPorAvaliacao}
                            filhaIdMap={filhaIdMap}
                            faltas={faltas}
                            mediaPonderadaData={mediaPonderadaData}
                            limites={limites}
                            turma={turma}
                        />
                    </Tabs.Tab>
                ))}
            </Tabs>
        </div>
    );
};

export default VisaoGeralTab;