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
        <section id="seguranca" className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
            <div className="mx-auto w-full max-w-[980px]">
                <div className="text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1f8fe5]">
                        Confiança
                    </span>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                        Segurança e confiabilidade
                    </h2>
                    <p className="mt-3 text-base leading-7 text-gray-500 sm:text-lg">
                        Seus dados e os dos seus alunos precisam ser tratados com responsabilidade.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {seguranca.map((item) => (
                        <div
                            key={item.titulo}
                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                        >
                            <div className="mb-8 flex justify-center">
                                <span className="flex h-11 w-11 items-center justify-center rounded border border-gray-200 bg-gray-50 text-[#1f8fe5]">
                                    <i className={`pi ${item.icon} text-lg`} aria-hidden="true" />
                                </span>
                            </div>
                            <h3 className="text-lg font-bold leading-snug text-gray-950">
                                {item.titulo}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                {item.descricao}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
