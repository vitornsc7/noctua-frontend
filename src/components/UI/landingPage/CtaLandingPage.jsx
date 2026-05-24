import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function CtaLandingPage() {
    const navigate = useNavigate();

    return (
        <section className="bg-white px-8 py-16">
            <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Comece a transformar seus dados educacionais em insights
                </h2>

                <p className="mt-3 max-w-2xl text-sm text-gray-500">
                    Junte-se aos professores que já estão utilizando Noctua para otimizar seu tempo e melhorar a aprendizagem dos seus alunos.
                </p>

                <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                    <Button onClick={() => navigate("/cadastro")}>
                        Criar minha conta
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            window.location.href = "mailto:contato.noctua.br@gmail.com";
                        }}
                    >
                        Fale conosco
                    </Button>
                </div>
            </div>
        </section>
    );
}
