import { Link } from 'react-router-dom';

export default function LandingPageFooter() {
    return (
        <footer className="relative overflow-hidden bg-white" aria-label="Rodape da landing page">
            <svg
                className="block h-8 w-full sm:h-10 lg:h-12"
                viewBox="0 0 1440 180"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    fill="#d8efff"
                    d="M0 122C170 118 300 112 450 96C620 78 760 52 930 42C1120 30 1290 38 1440 28V180H0V122Z"
                />
            </svg>
            <div className="bg-[#d8efff] px-4 pb-5 pt-1 sm:px-6 sm:pb-6 lg:px-10">
                <div className="mx-auto grid w-full max-w-[1440px] gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-[minmax(320px,1fr)_180px_minmax(0,290px)] lg:items-start lg:gap-16">
                    <div className="max-w-xl sm:col-span-2 lg:col-span-1">
                        <p className="text-2xl font-semibold leading-none text-gray-950 sm:text-4xl lg:text-5xl">
                            Noctua
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-700 sm:mt-4 sm:text-base sm:leading-7">
                            Insights poderosos que mudam a educação.
                        </p>
                    </div>

                    <div className="hidden min-w-0 text-sm sm:block">
                        <p className="font-semibold text-gray-950">Produto</p>
                        <nav className="mt-4 grid gap-3" aria-label="Links do produto">
                            <a className="text-gray-700 transition-colors hover:text-gray-950" href="#por-que-usar">
                                Por que usar?
                            </a>
                            <a className="text-gray-700 transition-colors hover:text-gray-950" href="#como-funciona">
                                Como funciona
                            </a>
                            <a className="text-gray-700 transition-colors hover:text-gray-950" href="#seguranca">
                                Segurança
                            </a>
                            <a className="text-gray-700 transition-colors hover:text-gray-950" href="#faq">
                                FAQ
                            </a>
                        </nav>
                    </div>

                    <div className="min-w-0 text-sm">
                        <p className="sr-only sm:not-sr-only sm:font-semibold sm:text-gray-950">Contato</p>
                        <nav className="flex flex-wrap gap-4 sm:mt-4 sm:grid sm:gap-3" aria-label="Links de contato">
                            <a
                                className="inline-flex min-w-0 items-center gap-2 text-gray-700 transition-colors hover:text-gray-950"
                                href="mailto:contato.noctua.br@gmail.com"
                            >
                                <i className="pi pi-envelope text-sm" aria-hidden="true" />
                                <span className="sm:hidden">E-mail</span>
                                <span className="hidden break-all sm:inline">contato.noctua.br@gmail.com</span>
                            </a>
                            <a
                                className="inline-flex min-w-0 items-center gap-2 text-gray-700 transition-colors hover:text-gray-950"
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

                <div className="mx-auto mt-5 flex w-full max-w-[1440px] flex-col gap-3 border-t border-[#b8ddf7] pt-4 text-xs text-gray-600 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-gray-600">
                        &copy; 2026 Noctua.
                    </p>
                    <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Links legais">
                        <Link className="transition-colors hover:text-gray-950" to="/termos-de-uso">
                            Termos de uso
                        </Link>
                        <Link className="transition-colors hover:text-gray-950" to="/politica-de-privacidade">
                            Política de privacidade
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
