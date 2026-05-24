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
        <section id="como-funciona" className="bg-[#F6F6F8]">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700">Veja como funciona</h2>
                    <p className="mt-2 text-sm text-gray-500">Uma visão geral do que você encontra ao acessar a plataforma.</p>
                </div>

                <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
                    <div className="aspect-[4/3] rounded-xl border border-gray-200 bg-white" />

                    <div className="space-y-6">
                        {destaques.map((item) => (
                            <div key={item.titulo}>
                                <h3 className="text-md font-semibold text-gray-700">{item.titulo}</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-500">
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
