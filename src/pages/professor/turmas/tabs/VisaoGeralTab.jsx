import React, { useEffect, useState } from 'react';
import { listarAlunos, listarFaltasPorTurma } from '../../../../api/turmaApi';
import { Button, Modal, useToast } from '../../../../components/UI';
import BoletimProgressivoTable from '../../../../components/UI/BoletimProgressivoTable';

const VisaoGeralTab = ({ turma }) => {
    const [alunos, setAlunos] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [intervencaoSelecionada, setIntervencaoSelecionada] = useState(null);
    const { showError } = useToast();

    const avaliacoesMockadas = [
        { periodo: 1, tipo: 'PROVA', media: 7.5 },
        { periodo: 1, tipo: 'TRABALHO', media: 8.2 },
        { periodo: 1, tipo: 'ATIVIDADE', media: 9.0 },
        { periodo: 2, tipo: 'PROVA', media: 6.8 },
    ];

    useEffect(() => {
        if (!turma?.id) return;

        setLoading(true);

        Promise.all([
            listarAlunos(turma.id, { ativo: true, page: 0, size: 100 }),
            listarFaltasPorTurma(turma.id),
        ])
            .then(([alunosData, faltasData]) => {
                setAlunos(alunosData.content ?? []);
                setFaltas(Array.isArray(faltasData) ? faltasData : (faltasData?.content ?? []));
            })
            .catch((err) => showError('Erro ao carregar visão geral', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, showError]);

    const intervencoes = [
        {
            titulo: 'Não necessária',
            quantidade: 26,
            descricao: 'Desempenho e frequência adequados.',
            color: 'emerald',
            icon: 'pi pi-check-circle',
            alunos: ['Ana Souza', 'Lucas Martins', 'Marina Costa'],
        },
        {
            titulo: 'Em monitoramento',
            quantidade: 24,
            descricao: 'Necessita acompanhamento preventivo.',
            color: 'sky',
            icon: 'pi pi-eye',
            alunos: ['Bruno Lima', 'Rafaela Dias'],
        },
        {
            titulo: 'Pedagógica',
            quantidade: 26,
            descricao: 'Necessita reforço pedagógico.',
            color: 'amber',
            icon: 'pi pi-book',
            alunos: ['Carla Mendes', 'João Silva'],
        },
        {
            titulo: 'Psicossocial',
            quantidade: 26,
            descricao: 'Possíveis fatores sociais ou emocionais.',
            color: 'orange',
            icon: 'pi pi-users',
            alunos: ['Diego Santos'],
        },
        {
            titulo: 'Urgente',
            quantidade: 26,
            descricao: 'Alto risco de evasão ou reprovação.',
            color: 'red',
            icon: 'pi pi-exclamation-triangle',
            alunos: ['Eduarda Rocha', 'Felipe Alves'],
        },
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

    const avaliacaoTemNota = (avaliacao) => {
        return avaliacao.media !== null && avaliacao.media !== undefined;
    };

    const periodosVisiveis = periodos.filter((periodo) => {
        if (periodo.numero === 1) return true;

        return avaliacoesMockadas.some(
            (avaliacao) =>
                Number(avaliacao.periodo) === periodo.numero &&
                avaliacaoTemNota(avaliacao)
        );
    });

    const calcularMediaAvaliacoes = (periodo, tipo) => {
        const avaliacoesDoTipo = avaliacoesMockadas.filter(
            (avaliacao) =>
                Number(avaliacao.periodo) === periodo &&
                avaliacao.tipo === tipo &&
                avaliacaoTemNota(avaliacao)
        );

        if (avaliacoesDoTipo.length === 0) return null;

        const soma = avaliacoesDoTipo.reduce(
            (total, avaliacao) => total + Number(avaliacao.media),
            0
        );

        return Number((soma / avaliacoesDoTipo.length).toFixed(1));
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

    return (
        <div className="space-y-12">
            <section className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
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
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média das provas
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'PROVA'))}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média dos trabalhos
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'TRABALHO'))}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Média das atividades
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularMediaAvaliacoes(periodo.numero, 'ATIVIDADE'))}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Frequência média
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-gray-800">
                                    {formatarValorResumo(calcularFrequenciaMedia(periodo.numero), '%')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Tipos de intervenção
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Classificação automática baseada na média e frequência dos alunos.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {intervencoes.map((item) => (
                        <div
                            key={item.titulo}
                            className={`
                                flex flex-col justify-between rounded-2xl border p-5
                                ${item.color === 'emerald' && 'border-emerald-200 bg-emerald-50'}
                                ${item.color === 'sky' && 'border-sky-200 bg-sky-50'}
                                ${item.color === 'amber' && 'border-amber-200 bg-amber-50'}
                                ${item.color === 'orange' && 'border-orange-200 bg-orange-50'}
                                ${item.color === 'red' && 'border-red-200 bg-red-50'}
                            `}
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <i
                                        className={`
                                            ${item.icon} text-sm
                                            ${item.color === 'emerald' && 'text-emerald-700'}
                                            ${item.color === 'sky' && 'text-sky-700'}
                                            ${item.color === 'amber' && 'text-amber-700'}
                                            ${item.color === 'orange' && 'text-orange-700'}
                                            ${item.color === 'red' && 'text-red-700'}
                                        `}
                                    />

                                    <h4
                                        className={`
                                            text-sm font-semibold
                                            ${item.color === 'emerald' && 'text-emerald-700'}
                                            ${item.color === 'sky' && 'text-sky-700'}
                                            ${item.color === 'amber' && 'text-amber-700'}
                                            ${item.color === 'orange' && 'text-orange-700'}
                                            ${item.color === 'red' && 'text-red-700'}
                                        `}
                                    >
                                        {item.titulo}
                                    </h4>
                                </div>

                                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                                    {item.descricao}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIntervencaoSelecionada(item)}
                                className={`
                                    mt-5 inline-flex w-fit cursor-pointer rounded-full px-3 py-1 text-xs font-semibold
                                    transition-all duration-200 hover:scale-105 hover:shadow-sm
                                    ${item.color === 'emerald' && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}
                                    ${item.color === 'sky' && 'bg-sky-100 text-sky-700 hover:bg-sky-200'}
                                    ${item.color === 'amber' && 'bg-amber-100 text-amber-700 hover:bg-amber-200'}
                                    ${item.color === 'orange' && 'bg-orange-100 text-orange-700 hover:bg-orange-200'}
                                    ${item.color === 'red' && 'bg-red-100 text-red-700 hover:bg-red-200'}
                                `}
                            >
                                {item.quantidade} alunos
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
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