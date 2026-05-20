import { useNavigate } from 'react-router-dom';
import corujinha from '../../../assets/corujinha.png';
import Button from '../Button';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section id="inicio" className="relative overflow-hidden bg-[#f7f8fa] lg:min-h-[calc(100vh-57px)]">
            <div className="pointer-events-none absolute inset-x-0 top-6 z-20 mx-auto hidden w-full max-w-[1440px] justify-end px-10 lg:flex">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/75 px-2.5 py-2 text-base shadow-sm ring-1 ring-gray-200/80 backdrop-blur">
                    <span className="rounded-full bg-[#e8f2ff] px-3 py-1 text-sm font-semibold text-[#1f8fe5]">
                        Novidade
                    </span>
                    <span className="px-1 text-base font-medium text-gray-700">
                        IA que entende sua rotina pedagógica
                    </span>
                    <i className="pi pi-sparkles pr-1 text-sm text-[#1f8fe5]" />
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-stretch gap-10 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 lg:min-h-[calc(100vh-57px)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-10 lg:pb-0">
                <div className="flex max-w-[720px] flex-col justify-start lg:-translate-y-8 lg:justify-center lg:pb-16">
                    <div className="mb-7 flex justify-start lg:hidden">
                        <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/70 px-2.5 py-2 text-sm shadow-sm ring-1 ring-gray-200/80 backdrop-blur sm:text-base">
                            <span className="rounded-full bg-[#e8f2ff] px-3 py-1 text-sm font-semibold text-[#1f8fe5]">
                                Novidade
                            </span>
                            <span className="min-w-0 px-1 text-sm font-medium text-gray-700 sm:text-base">
                                IA que entende sua rotina pedagógica
                            </span>
                            <i className="pi pi-sparkles pr-1 text-sm text-[#1f8fe5]" />
                        </div>
                    </div>

                    <div className="mb-6 flex items-end gap-3">
                        <h1 className="text-4xl font-semibold leading-none text-gray-950 sm:text-5xl">
                            Noctua
                        </h1>
                        <img
                            src={corujinha}
                            alt="Logo Noctua"
                            className="h-14 w-14 object-contain"
                        />
                    </div>

                    <h2 className="text-4xl font-bold leading-[1.08] text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl">
                        Apoio pedagógico{' '}
                        <span className="text-[#1f8fe5]">inteligente</span>{' '}
                        para professores
                    </h2>

                    <p className="mt-6 max-w-[620px] text-lg leading-8 text-gray-500 sm:mt-7 sm:text-xl">
                        Simplifique sua rotina e foque no que realmente importa:{' '}
                        <span className="underline decoration-current decoration-1 underline-offset-4">
                            ensinar
                        </span>.
                    </p>

                    <div className="mt-8">
                        <Button
                            onClick={() => navigate('/cadastro')}
                            className="w-full rounded-full px-6 py-3.5 text-base font-semibold shadow-sm sm:w-auto sm:min-w-[320px] sm:px-8 sm:text-lg"
                        >
                            Começar agora gratuitamente
                        </Button>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-gray-600 sm:gap-x-7 sm:text-base">
                        {['Gratuito', 'Sem instalação', 'Acesso pelo navegador'].map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#1f8fe5]/40 bg-white text-xs text-[#1f8fe5]">
                                    <i className="pi pi-check text-xs" />
                                </span>
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none relative hidden h-full min-h-[calc(100vh-65px)] items-end justify-end lg:flex">
                    <div className="absolute -right-52 -bottom-32 h-[820px] w-[1080px] bg-[radial-gradient(ellipse_at_58%_52%,rgba(31,143,229,0.24),rgba(134,199,239,0.15)_42%,rgba(247,248,250,0)_80%)] blur-3xl" />
                    <div className="absolute -left-16 bottom-16 h-96 w-[520px] rounded-full bg-[#65d6cf]/15 blur-3xl" />
                    <div className="relative z-10 h-[620px] w-full max-w-[680px] rounded-lg border-2 border-dashed border-[#9bb6ca] bg-white/80 shadow-sm" />
                </div>
            </div>
        </section>
    );
}
