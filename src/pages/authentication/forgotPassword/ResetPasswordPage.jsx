import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Input, Button, useToast } from "../../../components/UI";
import corujinha from "../../../assets/corujinha.png";
import { resetPassword } from "../../../api/authApi";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setCarregando(true);

            const response = await resetPassword({
                token,
                novaSenha,
                confirmacaoSenha,
            });

            showSuccess(
                response.message || "Senha redefinida com sucesso."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            showError(
                err.message || "Erro ao redefinir senha.",
                "Verifique os dados informados."
            );
        } finally {
            setCarregando(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f6f7f9] px-6 py-6">
                <div className="w-full md:max-w-[420px]">
                    <Card
                        variant="accent"
                        header={
                            <h2 className="text-lg font-medium text-gray-700">
                                Link inválido
                            </h2>
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-gray-500 m-0">
                                O link de redefinição de senha é inválido ou está incompleto.
                            </p>

                            <Link to="/login" className="underline text-sm">
                                Voltar ao login
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

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
                            Redefinir senha
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500 text-center m-0">
                                <Link to="/login" className="underline">
                                    Voltar ao login
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                form="reset-password-form"
                                disabled={carregando || !novaSenha || !confirmacaoSenha}
                            >
                                {carregando ? "Salvando..." : "Redefinir"}
                            </Button>
                        </div>
                    }
                >
                    <form
                        id="reset-password-form"
                        onSubmit={handleSubmit}
                        className="flex gap-3 flex-col"
                    >
                        <Input
                            label="Nova senha"
                            type="password"
                            placeholder="Digite a nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                        />

                        <Input
                            label="Confirmar nova senha"
                            type="password"
                            placeholder="Confirme a nova senha"
                            value={confirmacaoSenha}
                            onChange={(e) => setConfirmacaoSenha(e.target.value)}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
}