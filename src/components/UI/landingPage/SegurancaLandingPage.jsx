const seguranca = [
    {
        icon: 'pi-lock',
        titulo: 'Dados protegidos',
        descricao:
            'Boas práticas para proteger as informações cadastradas na plataforma.',
    },
    {
        icon: 'pi-shield',
        titulo: 'Acesso com autenticação',
        descricao:
            'Recursos de login e autenticação em dois fatores ajudam a proteger sua conta.',
    },
    {
        icon: 'pi-user',
        titulo: 'Privacidade no uso pedagógico',
        descricao:
            'A organização dos dados considera a responsabilidade no tratamento das informações escolares.',
    },
];

export default function SegurancaLandingPage() {
    return (
        <section id="seguranca" className="bg-white">
            <div className="mx-auto max-w-6xl px-8 py-16">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700">Segurança e confiabilidade</h2>
                    <p className="mt-2 text-sm text-gray-500">Seus dados e os dos seus alunos precisam ser tratados com responsabilidade.</p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {seguranca.map((item) => (
                        <div
                            key={item.titulo}
                            className="rounded-xl border border-gray-200 bg-[#F6F6F8] p-5"
                        >
                            <i className={`pi ${item.icon} text-base text-secondary`} aria-hidden="true" />
                            <h3 className="mt-3 text-sm font-semibold text-gray-700">
                                {item.titulo}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {item.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
