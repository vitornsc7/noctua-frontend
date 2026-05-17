import { useNavigate } from 'react-router-dom';
import corujinha from '../../../assets/corujinha.png';
import Button from '../Button';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="bg-[#f7f8fa]">
            <div className="mx-auto grid min-h-[360px] max-w-6xl grid-cols-1 items-start px-6 pb-14 pt-8 lg:grid-cols-2">
                <div className="max-w-[620px]">
                    <div className="mb-6 flex items-center gap-3">
                        <h1 className="text-4xl font-semibold leading-none tracking-[-0.03em] text-gray-950">
                            Noctua
                        </h1>
                        <img
                            src={corujinha}
                            alt="Logo Noctua"
                            className="h-11 w-11 translate-y-1 object-contain"
                        />
                    </div>

                    <h2 className="text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-gray-950 md:text-5xl">
                        Apoio pedagógico{' '}
                        <span className="text-[#1f8fe5]">inteligente</span>{' '}
                        para professores
                    </h2>

                    <p className="mt-5 max-w-[500px] text-lg leading-7 text-gray-500">
                        Simplifique sua rotina e foque no que realmente importa: ensinar.
                    </p>

                    <div className="mt-8">
                        <Button
                            onClick={() => navigate('/cadastro')}
                            className="min-w-[280px] rounded-full px-7 py-3 text-base font-semibold shadow-sm"
                        >
                            Começar agora gratuitamente
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
