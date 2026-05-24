const beneficios = [
    {
        icon: 'pi-users',
        titulo: 'Gestão de turmas simplificada',
        descricao:
            'Centralize todos os dados dos seus alunos em um único painel intuitivo.',
    },
    {
        icon: 'pi-file-edit',
        titulo: 'Avaliações estruturadas',
        descricao:
            'Gerencie provas, trabalhos e atividades de forma rápida.',
    },
    {
        icon: 'pi-chart-line',
        titulo: 'Métricas automáticas',
        descricao:
            'Gere relatórios instantâneos de evolução e desempenho individual ou coletivo.',
    },
    {
        icon: 'pi-chart-bar',
        titulo: 'Análise de aprendizagem',
        descricao:
            'Identifique lacunas de aprendizado e planeje intervenções precisas.',
    },
    {
        icon: 'pi-calendar',
        titulo: 'Frequência e notas',
        descricao:
            'Controle presenças e rendimento com registros digitais seguros e organizados.',
    },
];

export default function PorQueUsarLandingPage() {
    return (
        <section id="por-que-usar" className="bg-white">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700">Por que usar o Noctua?</h2>
                    <p className="mt-2 text-sm text-gray-500">Desenvolvido por quem entende as dores da sala de aula.</p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {beneficios.map((beneficio) => (
                        <article
                            key={beneficio.titulo}
                            className="rounded-xl border border-gray-200 bg-[#F6F6F8] p-5"
                        >
                            <i
                                className={`pi ${beneficio.icon} text-base text-secondary`}
                                aria-hidden="true"
                            />
                            <h3 className="mt-3 text-sm font-semibold text-gray-700">
                                {beneficio.titulo}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {beneficio.descricao}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
