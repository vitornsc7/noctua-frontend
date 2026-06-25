import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Input, Button, useToast } from "../../../components/UI";
import corujinha from "../../../assets/noctua.svg";
import { resetPassword } from "../../../api/authApi";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    const senhaMuitoCurta = novaSenha.length > 0 && novaSenha.length < 8;

    const senhaSemNumero =
        novaSenha.length > 0 && !/\d/.test(novaSenha);

    const senhasDiferentes =
        novaSenha.length > 0 &&
        confirmacaoSenha.length > 0 &&
        novaSenha !== confirmacaoSenha;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            showError("Link inválido.", "Solicite uma nova redefinição de senha.");
            return;
        }

        if (!novaSenha || !confirmacaoSenha) {
            showError("Preencha os campos obrigatórios.", "Informe e confirme a nova senha.");
            return;
        }

        if (novaSenha.length < 8) {
            showError("Senha inválida.", "A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (!/\d/.test(novaSenha)) {
            showError("Senha inválida.", "A nova senha deve conter pelo menos 1 número.");
            return;
        }

        if (novaSenha !== confirmacaoSenha) {
            showError("As senhas não coincidem.", "Digite a mesma senha nos dois campos.");
            return;
        }

        try {
            setCarregando(true);

            const response = await resetPassword({
                token,
                novaSenha,
                confirmacaoSenha,
            });

            showSuccess(
                response.message || "Senha redefinida com sucesso.",
                "Você será redirecionado para o login."
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

                            <Link to="/login" className="underline text-sm focus:outline-none focus:font-bold focus:text-secondary">
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
                    variant="accent"
                    header={
                        <h2 className="text-lg font-medium text-gray-700">
                            Redefinir senha
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500 text-center m-0">
                                <Link to="/login" className="underline focus:outline-none focus:font-bold focus:text-secondary">
                                    Voltar ao login
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                form="reset-password-form"
                                disabled={
                                    carregando ||
                                    !novaSenha ||
                                    !confirmacaoSenha ||
                                    senhaMuitoCurta ||
                                    senhaSemNumero ||
                                    senhasDiferentes
                                }
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

                        <p className="text-xs text-gray-500 m-0">
                            A senha deve ter pelo menos 8 caracteres e 1 número.
                        </p>

                        <Input
                            label="Confirmar nova senha"
                            type="password"
                            placeholder="Confirme a nova senha"
                            value={confirmacaoSenha}
                            onChange={(e) => setConfirmacaoSenha(e.target.value)}
                        />

                        {senhaMuitoCurta && (
                            <p className="text-sm text-red-500 m-0">
                                A senha deve ter pelo menos 8 caracteres.
                            </p>
                        )}

                        {senhaSemNumero && (
                            <p className="text-sm text-red-500 m-0">
                                A senha deve conter pelo menos 1 número.
                            </p>
                        )}

                        {senhasDiferentes && (
                            <p className="text-sm text-red-500 m-0">
                                As senhas informadas devem ser iguais.
                            </p>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
}