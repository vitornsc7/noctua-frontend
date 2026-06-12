import { Link } from 'react-router-dom';

export default function LandingPageFooter() {
    return (
        <footer className="bg-[#d8efff]" aria-label="Rodape da landing page">
            <div className="px-8 py-10 max-w-6xl mx-auto">
                <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_160px_260px] lg:items-start lg:gap-16">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-xl font-semibold text-gray-700">
                            Noctua
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-gray-500">
                            Insights poderosos que mudam a educação.
                        </p>
                    </div>

                    <div className="hidden min-w-0 text-sm sm:block">
                        <p className="font-semibold text-gray-950">Produto</p>
                        <nav className="mt-4 grid gap-3" aria-label="Links do produto">
                            <a className="text-gray-700 focus:outline-none focus:font-bold focus:text-secondary" href="#por-que-usar">
                                Por que usar?
                            </a>
                            <a className="text-gray-700 focus:outline-none focus:font-bold focus:text-secondary" href="#como-funciona">
                                Como funciona
                            </a>
                            <a className="text-gray-700 focus:outline-none focus:font-bold focus:text-secondary" href="#seguranca">
                                Segurança
                            </a>
                            <a className="text-gray-700 focus:outline-none focus:font-bold focus:text-secondary" href="#faq">
                                FAQ
                            </a>
                        </nav>
                    </div>

                    <div className="min-w-0 text-sm">
                        <p className="sr-only sm:not-sr-only sm:font-semibold sm:text-gray-950">Contato</p>
                        <nav className="flex flex-wrap gap-4 sm:mt-4 sm:grid sm:gap-3" aria-label="Links de contato">
                            <a
                                className="inline-flex min-w-0 items-center gap-2 text-gray-700 focus:outline-none focus:font-bold focus:text-secondary"
                                href="mailto:contato.noctua.br@gmail.com"
                            >
                                <i className="pi pi-envelope text-sm" aria-hidden="true" />
                                <span className="sm:hidden">E-mail</span>
                                <span className="hidden break-all sm:inline">contato.noctua.br@gmail.com</span>
                            </a>
                            <a
                                className="inline-flex min-w-0 items-center gap-2 text-gray-700 focus:outline-none focus:font-bold focus:text-secondary"
                                href="https://www.instagram.com/use_noctua/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="pi pi-instagram text-sm" aria-hidden="true" />
                                @use_noctua
                            </a>
                        </nav>
                    </div>
                </div>

                <div className="mx-auto mt-5 flex w-full max-w-[1440px] flex-col gap-3 border-t border-[#b8ddf7] pt-4 text-sm text-gray-600 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">
                        &copy; 2026 Noctua.
                    </p>
                    <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Links legais">
                        <Link className="transition-colors focus:outline-none focus:font-bold focus:text-secondary" to="/termos-de-uso">
                            Termos de uso
                        </Link>
                        <Link className="transition-colors focus:outline-none focus:font-bold focus:text-secondary" to="/politica-de-privacidade">
                            Política de privacidade
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
