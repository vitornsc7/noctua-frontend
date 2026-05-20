const destaques = [
    {
        titulo: 'Dashboard completo',
        descricao:
            'Ao fazer login, o professor visualiza suas turmas, métricas de desempenho, frequência dos alunos e alertas importantes em um único painel.',
    },
    {
        titulo: 'Dados organizados',
        descricao:
            'Cards informativos, tabelas e indicadores visuais facilitam a interpretação dos dados e apoiam decisões pedagógicas mais claras.',
    },
    {
        titulo: 'Acesso rápido',
        descricao:
            'A navegação foi pensada para acessar turmas, avaliações, frequência e relatórios com poucos cliques.',
    },
];

export default function ComoFuncionaLandingPage() {
    return (
        <section id="como-funciona" className="bg-[#f6f7f9] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <div className="mx-auto w-full max-w-[1220px]">
                <div className="text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1f8fe5]">
                        Plataforma
                    </span>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                        Veja como funciona
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-500 sm:text-lg">
                        Uma visão geral do que você encontra ao acessar a plataforma.
                    </p>
                </div>

                <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
                    <div className="relative">
                        <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(ellipse_at_58%_52%,rgba(31,143,229,0.22),rgba(134,199,239,0.13)_42%,rgba(246,247,249,0)_78%)] blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-80 rounded-full bg-[#65d6cf]/12 blur-3xl" />
                        <div className="relative z-10 aspect-[1.45/1] min-h-[220px] rounded-lg border-2 border-dashed border-[#9bb6ca] bg-white/80 shadow-sm sm:min-h-[300px] lg:min-h-[360px]" />
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {destaques.map((item) => (
                            <div key={item.titulo}>
                                <h3 className="text-xl font-bold text-gray-950">{item.titulo}</h3>
                                <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                                    {item.descricao}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
