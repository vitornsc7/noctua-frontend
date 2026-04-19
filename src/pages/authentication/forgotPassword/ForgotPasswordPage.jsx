import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Input, Button, useToast } from "../../../components/UI";
import corujinha from "../../../assets/corujinha.png";
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
                response.message || "Se existir uma conta com esse e-mail, enviaremos instruções para redefinição de senha."
            );

            setEmail("");
        } catch (err) {
            showError(
                err.message || "Erro ao solicitar redefinição de senha.",
                "Tente novamente em instantes."
            );
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#f6f7f9] px-6 py-6">
            <div className="w-full md:max-w-[420px]">
                <div className="text-center">
                    <img
                        src={corujinha}
                        alt="Logo Noctua"
                        className="w-[58px] h-[58px] object-contain mx-auto mb-1 block"
                    />
                    <h1 className="m-0 text-4xl font-medium leading-[1.22] tracking-[-3px] text-gray-900 font-['Inter',sans-serif]">
                        Noctua
                    </h1>
                    <p className="mt-2 mb-5 text-sm text-gray-500">
                        <span className="italic">Insights</span> poderosos que mudam a educação.
                    </p>
                </div>

                <Card
                    variant="accent"
                    header={
                        <h2 className="text-lg font-medium text-gray-700">
                            Esqueci minha senha
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500 text-center m-0">
                                Lembrou sua senha?{" "}
                                <Link to="/login" className="underline">
                                    Voltar ao login
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                form="forgot-password-form"
                                disabled={carregando || !email}
                            >
                                {carregando ? "Enviando..." : "Enviar"}
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