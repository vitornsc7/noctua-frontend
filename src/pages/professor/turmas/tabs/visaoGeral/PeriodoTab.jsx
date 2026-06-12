import React, { useState } from 'react';
import { Card, Table, Tooltip } from '../../../../../components/UI';
import { TIPO_AVALIACAO_DISPLAY, displayLabel, fmtNota } from '../../../../../utils/displayMaps';
import { INTERVENCAO_ICON, INTERVENCAO_TEXT_COLOR, getIntervencao } from '../../../../../utils/intervencaoUtils';
import { exportarBoletimPeriodo } from '../../../../../api/turmaApi';
import { useToast } from '../../../../../components/UI';

const PeriodoTab = ({
    periodo,
    alunos,
    avaliacoes,
    notasPorAvaliacao,
    filhaIdMap,
    faltas,
    mediaPonderadaData,
    limites,
    turma,
}) => {
    const [exporting, setExporting] = useState(false);
    const { showError } = useToast();

    const handleExport = () => {
        if (!turma?.id) return;
        setExporting(true);
        exportarBoletimPeriodo(turma.id, periodo.numero)
            .catch((err) => showError('Erro ao exportar boletim', err.message))
            .finally(() => setExporting(false));
    };
    const fmtFreq = (n) => (n != null ? `${String(n).replace('.', ',')}%` : '-');

    const fmtResumo = (valor, suffix = '') => {
        if (valor === null || valor === undefined) return '-';
        return `${String(valor).replace('.', ',')}${suffix}`;
    };

    const calcularMediaAvaliacoes = (tipo) => {
        const resumo = mediaPonderadaData?.resumoPorPeriodo?.[periodo.numero];
        if (!resumo) return null;
        const mapa = { PROVA: 'mediaProva', TRABALHO: 'mediaTrabalho', ATIVIDADE: 'mediaAtividade' };
        return resumo[mapa[tipo]] ?? null;
    };

    const calcularFrequenciaMedia = () => {
        const aulasPrevistas = Number(turma?.qtdeAulasPrevistasPeriodo) || 0;
        if (aulasPrevistas <= 0 || alunos.length === 0) return null;
        const frequencias = alunos.map((aluno) => {
            const totalFaltas = faltas
                .filter(
                    (f) =>
                        Number(f.alunoId ?? f.aluno?.id) === Number(aluno.id) &&
                        Number(f.periodo) === Number(periodo.numero)
                )
                .reduce((total, f) => total + Number(f.periodosFaltados ?? 1), 0);
            return ((aulasPrevistas - totalFaltas) / aulasPrevistas) * 100;
        });
        const soma = frequencias.reduce((total, f) => total + f, 0);
        return Number((soma / frequencias.length).toFixed(1));
    };

    const getNotaAluno = (alunoId, rootAvaliacaoId) => {
        const notas = notasPorAvaliacao[rootAvaliacaoId] ?? [];
        const nota = notas.find((n) => Number(n.alunoId ?? n.aluno?.id) === Number(alunoId));
        if (!nota) return { valor: null, naoRealizada: false, isSegundaChamada: false };
        if (nota.naoRealizada) {
            const filhaId = filhaIdMap[rootAvaliacaoId];
            if (filhaId) {
                const notaFilha = (notasPorAvaliacao[filhaId] ?? []).find(
                    (n) => Number(n.alunoId ?? n.aluno?.id) === Number(alunoId)
                );
                if (notaFilha?.valor != null)
                    return { valor: notaFilha.valor, naoRealizada: nota.naoRealizada, isSegundaChamada: true };
            }
            return { valor: nota.valor ?? null, naoRealizada: true, isSegundaChamada: false };
        }
        if (nota.valor != null) return { valor: nota.valor, naoRealizada: false, isSegundaChamada: false };
        return { valor: null, naoRealizada: false, isSegundaChamada: false };
    };

    const calcularFrequenciaAluno = (alunoId) => {
        const aulasPrevistas = Number(turma?.qtdeAulasPrevistasPeriodo) || 0;
        if (aulasPrevistas <= 0) return null;
        const totalFaltas = faltas
            .filter(
                (f) =>
                    Number(f.alunoId ?? f.aluno?.id) === Number(alunoId) &&
                    Number(f.periodo) === Number(periodo.numero)
            )
            .reduce((total, f) => total + Number(f.periodosFaltados ?? 1), 0);
        return Math.max(0, Number((((aulasPrevistas - totalFaltas) / aulasPrevistas) * 100).toFixed(1)));
    };

    const getMediaAlunoPeriodo = (alunoId) => {
        const m = mediaPonderadaData?.mediasAlunos?.find((a) => a.alunoId === alunoId);
        const val = m?.mediaPorPeriodo?.[periodo.numero];
        return val != null ? Number(val) : null;
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Boletim {periodo.titulo}</h3>
                    <button
                        onClick={!exporting ? handleExport : undefined}
                        className={`text-sm text-gray-600 underline underline-offset-4 transition focus:outline-none focus:font-bold focus:text-secondary ${exporting ? 'opacity-50 cursor-default' : 'hover:text-gray-700 cursor-pointer'}`}
                    >
                        Exportar
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Média das provas
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-800">
                        {fmtResumo(calcularMediaAvaliacoes('PROVA'))}
                    </p>
                </Card>
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Média dos trabalhos
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-800">
                        {fmtResumo(calcularMediaAvaliacoes('TRABALHO'))}
                    </p>
                </Card>
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Média das atividades
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-800">
                        {fmtResumo(calcularMediaAvaliacoes('ATIVIDADE'))}
                    </p>
                </Card>
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Frequência média
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-800">
                        {fmtResumo(calcularFrequenciaMedia(), '%')}
                    </p>
                </Card>
            </div>

            <Table data={alunos} rowKey="id" emptyMessage="Nenhum aluno cadastrado.">
                <Table.Column header="Aluno" accessor="nome" />
                {avaliacoes.map((av, idx) => (
                    <Table.Column
                        key={String(av.id)}
                        id={String(av.id)}
                        headerClassName="text-center"
                        header={
                            <div>
                                <Tooltip
                                    className="cursor-default"
                                    content={`${displayLabel(TIPO_AVALIACAO_DISPLAY, av.tipo)}: ${av.tema}`}
                                >
                                    AV{idx + 1}
                                    {av.peso !== 1 && (
                                        <span className="ml-1 text-gray-700">(P{av.peso})</span>
                                    )}
                                </Tooltip>
                            </div>
                        }
                        className="text-center"
                        render={(aluno) => {
                            const { valor, naoRealizada, isSegundaChamada } = getNotaAluno(aluno.id, av.id);
                            if (valor != null) {
                                return (
                                    <span>
                                        {valor > 0 ? (
                                            <span>{fmtNota(valor)}</span>
                                        ) : (
                                            naoRealizada ? <Tooltip content="Aluno(a) não realizou a avaliação.">
                                                <div className="inline-flex items-center gap-1 cursor-default">
                                                    <span>{fmtNota(valor)}</span>
                                                    <i className="pi pi-info-circle text-xs text-gray-400" aria-hidden="true" />
                                                </div>
                                            </Tooltip> :
                                                <span>{fmtNota(0)}</span>
                                        )}
                                    </span>
                                );
                            }
                            return <span>-</span>;
                        }}
                    />
                ))}
                <Table.Column
                    header="Média"
                    headerClassName="text-center"
                    className="text-center border-l"
                    render={(aluno) => {
                        const media = getMediaAlunoPeriodo(aluno.id);
                        return media != null ? (
                            <span className="text-gray-800">
                                {Number(media).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        ) : (
                            '-'
                        );
                    }}
                />
                <Table.Column
                    header="Freq."
                    headerClassName="text-center"
                    className="text-center"
                    render={(aluno) => fmtFreq(calcularFrequenciaAluno(aluno.id))}
                />
                {limites && (
                    <Table.Column
                        header="Sugestão"
                        headerClassName="text-center"
                        className="text-center border-l"
                        render={(aluno) => {
                            const freq = calcularFrequenciaAluno(aluno.id);
                            const media = getMediaAlunoPeriodo(aluno.id);
                            const intervencao = getIntervencao(media, freq, limites, turma?.mediaMinima);
                            return intervencao ? (
                                <span
                                    className={`inline-flex items-center gap-1 text-xs font-medium ${INTERVENCAO_TEXT_COLOR[intervencao] ?? 'text-gray-500'}`}
                                >
                                    <i
                                        className={`${INTERVENCAO_ICON[intervencao]} text-xs`}
                                        aria-hidden="true"
                                    />
                                    {intervencao}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-300">-</span>
                            );
                        }}
                    />
                )}
            </Table>
        </div>
    );
};

export default PeriodoTab;
