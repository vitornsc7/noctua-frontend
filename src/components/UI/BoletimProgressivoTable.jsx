import React from 'react';
import { getIntervencao, INTERVENCAO_TEXT_COLOR, INTERVENCAO_ICON } from '../../utils/intervencaoUtils';

export default function BoletimProgressivoTable({ alunos = [], faltas = [], turma, mediasAlunos = [], loading = false, limites = null, mediaMinima = null }) {
    const periodicidade = String(turma?.periodicidade ?? '').toUpperCase();
    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);

    const isTrimestral = periodicidade.includes('TRIMEST') || qtdePeriodosTurma === 3;
    const qtdePeriodos = isTrimestral ? 3 : 4;

    const periodos = Array.from({ length: qtdePeriodos }, (_, index) => {
        const numero = index + 1;
        return isTrimestral ? `${numero}º Trimestre` : `${numero}º Bimestre`;
    });

    const aulasPrevistasPorPeriodo =
        Number(turma?.qtdeAulasPrevistasPeriodo ?? turma?.aulasPrevistasPeriodo ?? turma?.aulasPorPeriodo) || 0;

    const mediasPorAlunoId = Object.fromEntries(
        mediasAlunos.map((m) => [m.alunoId, m.mediaPorPeriodo ?? {}])
    );

    const calcularFrequencia = (alunoId, periodo) => {
        if (aulasPrevistasPorPeriodo <= 0) return null;

        const totalFaltas = faltas
            .filter((falta) => {
                const faltaAlunoId = falta.alunoId ?? falta.aluno?.id;

                return (
                    Number(faltaAlunoId) === Number(alunoId) &&
                    Number(falta.periodo) === Number(periodo)
                );
            })
            .reduce((total, falta) => total + Number(falta.periodosFaltados ?? 1), 0);

        const frequencia =
            ((aulasPrevistasPorPeriodo - totalFaltas) / aulasPrevistasPorPeriodo) * 100;

        return Math.max(0, Number(frequencia.toFixed(1)));
    };

    const calcularFrequenciaFinalParcial = (alunoId) => {
        if (aulasPrevistasPorPeriodo <= 0) return null;

        const totalAulasPrevistas = aulasPrevistasPorPeriodo * qtdePeriodos;

        const totalFaltas = faltas
            .filter((falta) => {
                const faltaAlunoId = falta.alunoId ?? falta.aluno?.id;
                return Number(faltaAlunoId) === Number(alunoId);
            })
            .reduce((total, falta) => total + Number(falta.periodosFaltados ?? 1), 0);

        const frequencia =
            ((totalAulasPrevistas - totalFaltas) / totalAulasPrevistas) * 100;

        return Math.max(0, Number(frequencia.toFixed(1)));
    };

    const alunosBoletim = alunos.map((aluno) => {
        const mediasDoAluno = mediasPorAlunoId[aluno.id] ?? {};

        const mediasComValor = periodos
            .map((_, index) => mediasDoAluno[index + 1])
            .filter((v) => v != null);
        const mediaFinal =
            mediasComValor.length > 0
                ? Number(
                    (
                        mediasComValor.reduce((s, v) => s + Number(v), 0) / mediasComValor.length
                    ).toFixed(2)
                )
                : null;

        const frequenciaFinal = calcularFrequenciaFinalParcial(aluno.id);
        const sugestao =
            limites && mediaFinal != null && frequenciaFinal != null
                ? getIntervencao(mediaFinal, frequenciaFinal, limites, mediaMinima)
                : null;

        return {
            id: aluno.id,
            nome: aluno.nome,
            periodos: periodos.reduce((acc, _, index) => {
                const numeroPeriodo = index + 1;
                acc[numeroPeriodo] = {
                    media: mediasDoAluno[numeroPeriodo] ?? null,
                    frequencia: calcularFrequencia(aluno.id, numeroPeriodo),
                };
                return acc;
            }, {}),
            final: {
                media: mediaFinal,
                frequencia: frequenciaFinal,
            },
            sugestao,
        };
    });

    const formatarNumero = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return String(valor).replace('.', ',');
    };

    const formatarFrequencia = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return `${formatarNumero(valor)}%`;
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <i className="pi pi-spin pi-spinner text-2xl text-gray-400" aria-hidden="true" />
                </div>
            ) : (
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-100 border-b text-gray-700">
                        <tr>
                            <th rowSpan={2} className="left-0 z-20 bg-gray-100 px-4 py-3 text-center font-medium text-xs uppercase">
                                Aluno
                            </th>

                            {periodos.map((periodo) => (
                                <th key={periodo} colSpan={2} className="border-l border-gray-200 px-4 py-3 text-center font-medium text-xs uppercase">
                                    {periodo}
                                </th>
                            ))}

                            <th colSpan={2} className="border-l border-gray-200 px-4 py-3 text-center font-medium text-xs uppercase">
                                Final parcial
                            </th>
                            {limites && (
                                <th rowSpan={2} className="border-l border-gray-200 px-4 py-3 text-center font-medium text-xs uppercase">
                                    Sugestão
                                </th>
                            )}
                        </tr>

                        <tr>
                            {periodos.map((periodo) => (
                                <React.Fragment key={periodo}>
                                    <th className="border-l border-gray-200 px-3 py-2 text-center font-medium text-xs uppercase">Méd.</th>
                                    <th className="px-3 py-2 text-center font-medium text-xs uppercase">Freq.</th>
                                </React.Fragment>
                            ))}

                            <th className="border-l border-gray-200 px-3 py-2 text-center font-medium text-xs uppercase">Méd.</th>
                            <th className="px-3 py-2 text-center font-medium text-xs uppercase">Freq.</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {alunosBoletim.map((aluno) => (
                            <tr key={aluno.id} className="hover:bg-gray-50 text-gray-600">
                                <td className=" bg-white px-4 py-3">
                                    {aluno.nome}
                                </td>

                                {periodos.map((_, index) => {
                                    const numeroPeriodo = index + 1;
                                    const dados = aluno.periodos[numeroPeriodo];

                                    return (
                                        <React.Fragment key={numeroPeriodo}>
                                            <td className="border-l border-gray-100 px-3 py-3 text-center font-semibold">
                                                {formatarNumero(dados?.media)}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                {formatarFrequencia(dados?.frequencia)}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}

                                <td className="border-l border-gray-100 px-3 py-3 text-center font-semibold">
                                    {formatarNumero(aluno.final.media)}
                                </td>
                                <td className="px-3 py-3 text-center">
                                    {formatarFrequencia(aluno.final.frequencia)}
                                </td>
                                {limites && (
                                    <td className="border-l border-gray-100 px-3 py-3 text-center">
                                        {aluno.sugestao ? (
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${INTERVENCAO_TEXT_COLOR[aluno.sugestao]}`}>
                                                <i className={`${INTERVENCAO_ICON[aluno.sugestao]} text-sm`} aria-hidden="true" />
                                                {aluno.sugestao}
                                            </span>
                                        ) : '-'}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}