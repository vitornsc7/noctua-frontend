import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function CtaLandingPage() {
    const navigate = useNavigate();

    return (
        <section
            className="bg-white px-4 sm:px-6 lg:px-10"
            style={{ paddingTop: "180px", paddingBottom: "220px" }}
        >
            <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center text-center">
                <h2 className="max-w-4xl text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
                    Comece a transformar seus dados educacionais em insights
                </h2>

                <p className="mt-2 max-w-5xl text-base leading-7 text-slate-500 sm:text-lg">
                    Junte-se aos professores que já estão utilizando Noctua para otimizar seu tempo e melhorar a aprendizagem dos seus alunos.
                </p>

                <div
                    className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5"
                    style={{ marginTop: "88px" }}
                >
                    <Button
                        onClick={() => navigate("/cadastro")}
                        className="w-full min-w-[210px] rounded-md px-8 py-3 text-base font-semibold shadow-[0_18px_45px_rgba(31,143,229,0.18)] sm:w-auto"
                    >
                        Criar minha conta
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            window.location.href = "mailto:contato.noctua.br@gmail.com";
                        }}
                        className="w-full min-w-[210px] rounded-md border-slate-200 bg-white px-8 py-3 text-base font-semibold text-gray-950 hover:bg-slate-50 sm:w-auto"
                    >
                        Falar com um consultor
                    </Button>
                </div>
            </div>
        </section>
    );
}
