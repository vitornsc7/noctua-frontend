import { useNavigate } from 'react-router-dom';
import corujinha from '../../../assets/noctua.svg';
import Button from '../Button';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section id="inicio" className="bg-[#F6F6F8]">
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-8 py-16 lg:grid-cols-2">
                <div className="flex flex-col">
                    <div className="mb-5 flex items-center gap-3">
                        <h1 className="text-4xl font-semibold text-secondary tracking-tighter">
                            Noctua
                        </h1>
                        <img
                            src={corujinha}
                            alt="Logo Noctua"
                            className="w-12 object-contain"
                        />
                    </div>

                    <h2 className="text-5xl font-semibold leading-tight text-gray-600">
                        Apoio pedagógico
                        <span className="text-secondary"> inteligente </span>
                        para professores
                    </h2>

                    <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500">
                        Simplifique sua rotina e foque no que realmente importa:{' '}
                        <span className="underline decoration-current decoration-1 underline-offset-4">
                            ensinar
                        </span>.
                    </p>

                    <div className="mt-6">
                        <Button onClick={() => navigate('/cadastro')}>
                            Começar agora gratuitamente
                        </Button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                        {['Gratuito', 'Sem instalação', 'Acesso pelo navegador'].map((benefit) => (
                            <div key={benefit} className="flex items-center gap-1.5">
                                <i className="pi pi-check text-xs text-secondary" aria-hidden="true" />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden aspect-[4/3] rounded-xl border border-gray-200 bg-white lg:block" />
            </div>
        </section>
    );
}
