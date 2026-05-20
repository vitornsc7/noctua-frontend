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
        <section id="por-que-usar" className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <div className="mx-auto w-full max-w-[1220px]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                        Por que usar o Noctua?
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-500 sm:text-lg">
                        Desenvolvido por quem entende as dores da sala de aula.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    {beneficios.map((beneficio) => (
                        <article
                            key={beneficio.titulo}
                            className="rounded-lg border border-gray-200 bg-[#f7f8fa] p-6 shadow-sm"
                        >
                            <div className="mb-5 flex justify-center lg:justify-start">
                                <i
                                    className={`pi ${beneficio.icon} text-xl text-[#1f8fe5]`}
                                    aria-hidden="true"
                                />
                            </div>
                            <h3 className="text-lg font-bold leading-snug text-gray-950">
                                {beneficio.titulo}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                {beneficio.descricao}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
