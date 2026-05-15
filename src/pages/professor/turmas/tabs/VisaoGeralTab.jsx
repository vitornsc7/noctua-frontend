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

    useEffect(() => {
        if (!turma?.id) return;

        setLoading(true);

        Promise.all([
            listarAlunos(turma.id, { ativo: true, page: 0, size: 100 }),
            listarFaltasPorTurma(turma.id),
        ])
            .then(([alunosData, faltasData]) => {
                setAlunos(alunosData.content ?? []);
                setFaltas(faltasData ?? []);
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

    return (
        <div className="space-y-8">
            <section className="space-y-3">
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
                                flex min-h-[190px] flex-col justify-between rounded-2xl border p-5
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

            <section className="space-y-3">
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
                } footer={
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