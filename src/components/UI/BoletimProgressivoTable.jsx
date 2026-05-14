import React from 'react';

export default function BoletimProgressivoTable({ alunos = [], loading = false }) {
    const periodos = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

    /*const alunos = [
        {
            id: 1,
            nome: 'Ana Souza',
            periodos: {
                1: { media: 9.2, frequencia: 96 },
                2: { media: 8.8, frequencia: 94 },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: 9.0, frequencia: 95 },
            intervencao: 'Não necessária',
        },
        {
            id: 2,
            nome: 'Bruno Lima',
            periodos: {
                1: { media: 7.4, frequencia: 88 },
                2: { media: 7.1, frequencia: 85 },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: 7.25, frequencia: 86.5 },
            intervencao: 'Em monitoramento',
        },
        {
            id: 3,
            nome: 'Carla Mendes',
            periodos: {
                1: { media: 6.2, frequencia: 82 },
                2: { media: null, frequencia: null },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: 6.2, frequencia: 82 },
            intervencao: 'Pedagógica',
        },
        {
            id: 4,
            nome: 'Diego Santos',
            periodos: {
                1: { media: 8.0, frequencia: 72 },
                2: { media: 7.8, frequencia: 70 },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: 7.9, frequencia: 71 },
            intervencao: 'Psicossocial',
        },
        {
            id: 5,
            nome: 'Eduarda Rocha',
            periodos: {
                1: { media: 4.8, frequencia: 68 },
                2: { media: 5.1, frequencia: 66 },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: 4.95, frequencia: 67 },
            intervencao: 'Urgente',
        },
        {
            id: 6,
            nome: 'Felipe Alves',
            periodos: {
                1: { media: null, frequencia: null },
                2: { media: null, frequencia: null },
                3: { media: null, frequencia: null },
                4: { media: null, frequencia: null },
            },
            final: { media: null, frequencia: null },
            intervencao: 'Aguardando dados',
        },
    ];*/

    const alunosBoletim = alunos.map((aluno) => ({
        id: aluno.id,
        nome: aluno.nome,
        periodos: {
            1: { media: null, frequencia: null },
            2: { media: null, frequencia: null },
            3: { media: null, frequencia: null },
            4: { media: null, frequencia: null },
        },
        final: { media: null, frequencia: null },
        intervencao: 'Aguardando dados',
    }));

    const formatarNumero = (valor) => {
        if (valor === null || valor === undefined) return '—';
        return String(valor).replace('.', ',');
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
            {loading && (
                <div className="px-4 py-6 text-sm text-gray-400 italic">
                    Carregando boletim progressivo anual...
                </div>
            )}
            <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-600">
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
                    {alunosBoletim.map((aluno) =>
                    (<tr key={aluno.id} className="hover:bg-gray-50">
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
                                        {dados?.frequencia ? `${formatarNumero(dados.frequencia)}%` : '—'}
                                    </td>
                                </React.Fragment>
                            );
                        })}

                        <td className="border-l border-gray-100 px-3 py-3 text-center font-semibold text-gray-800">
                            {formatarNumero(aluno.final.media)}
                        </td>
                        <td className="px-3 py-3 text-center text-gray-600">
                            {aluno.final.frequencia !== null && aluno.final.frequencia !== undefined
                                ? `${formatarNumero(aluno.final.frequencia)}%`
                                : '—'}
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
        </div>
    );
}