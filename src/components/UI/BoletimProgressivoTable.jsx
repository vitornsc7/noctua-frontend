import React from 'react';

export default function BoletimProgressivoTable({ alunos = [], faltas = [], turma, loading = false }) {
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

    const alunosBoletim = alunos.map((aluno) => ({
        id: aluno.id,
        nome: aluno.nome,
        periodos: periodos.reduce((acc, _, index) => {
            const numeroPeriodo = index + 1;

            acc[numeroPeriodo] = {
                media: null,
                frequencia: calcularFrequencia(aluno.id, numeroPeriodo),
            };

            return acc;
        }, {}),
        final: {
            media: null,
            frequencia: calcularFrequenciaFinalParcial(aluno.id),
        },
        intervencao: 'Aguardando dados',
    }));

    const formatarNumero = (valor) => {
        if (valor === null || valor === undefined) return '—';
        return String(valor).replace('.', ',');
    };

    const formatarFrequencia = (valor) => {
        if (valor === null || valor === undefined) return '—';
        return `${formatarNumero(valor)}%`;
    };

    const getIntervencaoClass = (intervencao) => {
        const classes = {
            'Aguardando dados': 'bg-gray-50 text-gray-500 ring-1 ring-gray-200',
            'Não necessária': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
            'Em monitoramento': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
            Pedagógica: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
            Psicossocial: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
            Urgente: 'bg-red-50 text-red-700 ring-1 ring-red-200',
        };

        return classes[intervencao] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';
    };

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
                <div className="px-4 py-6 text-sm text-gray-400 italic">
                    Carregando boletim progressivo anual...
                </div>
            ) : (
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-50 border-b text-xs font-semibold uppercase text-gray-600">
                        <tr>
                            <th rowSpan={2} className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-center">
                                Aluno
                            </th>

                            {periodos.map((periodo) => (
                                <th key={periodo} colSpan={2} className="border-l border-gray-200 px-4 py-3 text-center">
                                    {periodo}
                                </th>
                            ))}

                            <th colSpan={2} className="border-l border-gray-200 px-4 py-3 text-center">
                                Final parcial
                            </th>

                            <th rowSpan={2} className="border-l border-gray-200 px-4 py-3 text-center">
                                Sugestão de intervenção
                            </th>
                        </tr>

                        <tr>
                            {periodos.map((periodo) => (
                                <React.Fragment key={periodo}>
                                    <th className="border-l border-gray-200 px-3 py-2 text-center">Méd.</th>
                                    <th className="px-3 py-2 text-center">Freq.</th>
                                </React.Fragment>
                            ))}

                            <th className="border-l border-gray-200 px-3 py-2 text-center">Méd.</th>
                            <th className="px-3 py-2 text-center">Freq.</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {alunosBoletim.map((aluno) => (
                            <tr key={aluno.id} className="hover:bg-gray-50">
                                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-gray-800">
                                    {aluno.nome}
                                </td>

                                {periodos.map((_, index) => {
                                    const numeroPeriodo = index + 1;
                                    const dados = aluno.periodos[numeroPeriodo];

                                    return (
                                        <React.Fragment key={numeroPeriodo}>
                                            <td className="border-l border-gray-100 px-3 py-3 text-center font-semibold text-gray-800">
                                                {formatarNumero(dados?.media)}
                                            </td>
                                            <td className="px-3 py-3 text-center text-gray-600">
                                                {formatarFrequencia(dados?.frequencia)}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}

                                <td className="border-l border-gray-100 px-3 py-3 text-center font-semibold text-gray-800">
                                    {formatarNumero(aluno.final.media)}
                                </td>
                                <td className="px-3 py-3 text-center text-gray-600">
                                    {formatarFrequencia(aluno.final.frequencia)}
                                </td>

                                <td className="border-l border-gray-100 px-4 py-3 text-center">
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getIntervencaoClass(
                                            aluno.intervencao
                                        )}`}
                                    >
                                        {aluno.intervencao}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}