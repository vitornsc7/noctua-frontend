import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarAlunos, listarFaltasPorTurma, calcularMediaPonderadaTurma } from '../../../../api/turmaApi';
import { Button, Card, Modal, useToast } from '../../../../components/UI';
import BoletimProgressivoTable from '../../../../components/UI/BoletimProgressivoTable';

const VisaoGeralTab = ({ turma }) => {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [mediaPonderadaData, setMediaPonderadaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [intervencaoSelecionada, setIntervencaoSelecionada] = useState(null);
    const { showError } = useToast();

    useEffect(() => {
        if (!turma?.id) return;

        setLoading(true);

        Promise.all([
            listarAlunos(turma.id, { ativo: true, page: 0, size: 100 }),
            listarFaltasPorTurma(turma.id),
            calcularMediaPonderadaTurma(turma.id),
        ])
            .then(([alunosData, faltasData, mpData]) => {
                setAlunos(alunosData.content ?? []);
                setFaltas(Array.isArray(faltasData) ? faltasData : (faltasData?.content ?? []));
                setMediaPonderadaData(mpData);
            })
            .catch((err) => showError('Erro ao carregar visão geral', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, showError]);

    const INTERVENCAO_COLORS = {
        emerald: { border: 'border-t-emerald-400', label: 'text-emerald-700' },
        sky: { border: 'border-t-sky-400', label: 'text-sky-700' },
        amber: { border: 'border-t-amber-400', label: 'text-amber-700' },
        orange: { border: 'border-t-orange-400', label: 'text-orange-700' },
        red: { border: 'border-t-red-400', label: 'text-red-700' },
    };

    const intervencoes = [
        { titulo: 'Não necessária', descricao: 'Desempenho e frequência adequados.', color: 'emerald', icon: 'pi pi-check-circle' },
        { titulo: 'Em monitoramento', descricao: 'Necessita acompanhamento preventivo.', color: 'sky', icon: 'pi pi-eye' },
        { titulo: 'Pedagógica', descricao: 'Necessita reforço pedagógico.', color: 'amber', icon: 'pi pi-book' },
        { titulo: 'Psicossocial', descricao: 'Possíveis fatores sociais ou emocionais.', color: 'orange', icon: 'pi pi-users' },
        { titulo: 'Urgente', descricao: 'Alto risco de evasão ou reprovação.', color: 'red', icon: 'pi pi-exclamation-triangle' },
    ];

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
        if (periodo.numero === 1) return true;
        const resumo = mediaPonderadaData?.resumoPorPeriodo?.[periodo.numero];
        return resumo != null && (
            resumo.mediaProva != null ||
            resumo.mediaTrabalho != null ||
            resumo.mediaAtividade != null
        );
    });

    const calcularMediaAvaliacoes = (numeroPeriodo, tipo) => {
        const resumo = mediaPonderadaData?.resumoPorPeriodo?.[numeroPeriodo];
        if (!resumo) return null;
        const mapa = { PROVA: 'mediaProva', TRABALHO: 'mediaTrabalho', ATIVIDADE: 'mediaAtividade' };
        return resumo[mapa[tipo]] ?? null;
    };

    const calcularFrequenciaMedia = (periodo) => {
        const aulasPrevistas = Number(turma?.qtdeAulasPrevistasPeriodo) || 0;

        if (aulasPrevistas <= 0 || alunos.length === 0) return null;

        const frequencias = alunos.map((aluno) => {
            const totalFaltas = faltas
                .filter((falta) => {
                    const faltaAlunoId = falta.alunoId ?? falta.aluno?.id;

                    return (
                        Number(faltaAlunoId) === Number(aluno.id) &&
                        Number(falta.periodo) === Number(periodo)
                    );
                })
                .reduce(
                    (total, falta) => total + Number(falta.periodosFaltados ?? 1),
                    0
                );

            return ((aulasPrevistas - totalFaltas) / aulasPrevistas) * 100;
        });

        const soma = frequencias.reduce((total, frequencia) => total + frequencia, 0);

        return Number((soma / frequencias.length).toFixed(1));
    };

    const formatarValorResumo = (valor, suffix = '') => {
        if (valor === null || valor === undefined) return '-';
        return `${String(valor).replace('.', ',')}${suffix}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <i className="pi pi-spin pi-spinner text-2xl text-gray-400" aria-hidden="true"></i>
            </div>
        );
    }

    const temDadosAvaliacao = mediaPonderadaData?.resumoPorPeriodo != null &&
        Object.values(mediaPonderadaData.resumoPorPeriodo).some(
            (r) => r?.mediaProva != null || r?.mediaTrabalho != null || r?.mediaAtividade != null
        );
    const temDadosFalta = faltas.length > 0;
    const semDados = !loading && !temDadosAvaliacao && !temDadosFalta;

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
                        <i className="pi pi-plus mr-2 text-xs" aria-hidden="true"></i>
                        Nova avaliação
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/turmas/${turma.id}/faltas/nova`)}>
                        <i className="pi pi-plus mr-2 text-xs" aria-hidden="true"></i>
                        Nova falta
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Resumo por {periodoLabel.toLowerCase()}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Indicadores calculados a partir das avaliações e frequências registradas em cada {periodoLabel.toLowerCase()}.
                    </p>
                </div>

                {periodosVisiveis.map((periodo) => (
                    <div key={periodo.numero} className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase text-gray-700">
                            {periodo.titulo}
                        </h3>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média das provas
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'PROVA'))}
                                </p>
                            </Card>

                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média dos trabalhos
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'TRABALHO'))}
                                </p>
                            </Card>

                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média das atividades
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'ATIVIDADE'))}
                                </p>
                            </Card>

                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Frequência média
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularFrequenciaMedia(periodo.numero), '%')}
                                </p>
                            </Card>
                        </div>
                    </div>
                ))}
            </section>

            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Tipos de intervenção
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Classificação automática baseada na média e frequência dos alunos.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
                    {intervencoes.map((item) => {
                        const c = INTERVENCAO_COLORS[item.color];
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
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Boletim progressivo anual
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Acompanhe a média, frequência e sugestão de intervenção dos alunos ao longo do ano letivo.
                    </p>
                </div>

                <BoletimProgressivoTable
                    alunos={alunos}
                    faltas={faltas}
                    turma={turma}
                    mediasAlunos={mediaPonderadaData?.mediasAlunos ?? []}
                    loading={loading}
                />
            </section>

            <Modal
                isOpen={Boolean(intervencaoSelecionada)}
                onClose={() => setIntervencaoSelecionada(null)}
                title={
                    intervencaoSelecionada
                        ? `Intervenção: ${intervencaoSelecionada.titulo.toLowerCase()}`
                        : ''
                }
                footer={
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setIntervencaoSelecionada(null)}>
                            Fechar
                        </Button>
                    </div>
                }
            >
                <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                        Alunos classificados com esta intervenção:
                    </p>

                    <div className="rounded-xl border border-gray-200 bg-gray-50">
                        {(intervencaoSelecionada?.alunos ?? []).map((aluno) => (
                            <div
                                key={aluno}
                                className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 last:border-b-0"
                            >
                                {aluno}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default VisaoGeralTab;