import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Input, Button, useToast } from "../../../components/UI";
import corujinha from "../../../assets/noctua.svg";
import { forgotPassword } from "../../../api/authApi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [carregando, setCarregando] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setCarregando(true);

            const response = await forgotPassword(email);

            showSuccess(
                'E-mail enviado',
                response.message || "Se existir uma conta com esse e-mail, enviaremos instruções para redefinição de senha."
            );

            setEmail("");
            setCarregando(false);
        } catch (err) {
            showError(
                err.message || "Erro ao solicitar redefinição de senha.",
                "Tente novamente em instantes."
            );
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#f6f7f9] px-6 py-6">
            <div className="w-full md:max-w-[420px]">
                <div>
                    <div className="flex items-center justify-center">
                        <span className="text-4xl font-medium tracking-tighter text-primary font-['Inter',sans-serif]">
                            Noctua
                        </span>
                        <img
                            src={corujinha}
                            alt="Logo Noctua"
                            className="w-10 ml-2"
                        />
                    </div>
                    <p className="mt-2 mb-5 text-sm text-gray-500 text-center">
                        <span className="italic">Insights</span> poderosos que mudam a educação.
                    </p>
                </div>

                <Card
                    header={
                        <h2 className="text-lg font-medium text-gray-700">
                            Esqueci minha senha
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500 text-center m-0">
                                Lembrou sua senha?{" "}
                                <Link to="/login" className="underline focus:outline-none focus:font-bold focus:text-secondary">
                                    Voltar ao login
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                form="forgot-password-form"
                                disabled={carregando || !email}
                            >
                                {carregando && <i className="text-xs pi pi-spin pi-spinner"></i>}
                                Enviar
                            </Button>
                        </div>
                    }
                >
                    <form
                        id="forgot-password-form"
                        onSubmit={handleSubmit}
                        className="flex gap-3 flex-col"
                    >
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="Digite seu e-mail cadastrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
}