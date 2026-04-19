import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button, Checkbox, useToast } from '../../../components/UI';
import corujinha from '../../../assets/corujinha.png';
import { loginSchema, LOGIN_INITIAL_VALUES } from '../authSchema';
import { login, setToken, verifyLogin2FA } from '../../../api/authApi';

export default function LoginPage() {
    const [carregando, setCarregando] = useState(false);
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [codigo2fa, setCodigo2fa] = useState('');
    const { showError } = useToast();
    const navigate = useNavigate();

    const {
        watch,
        setValue,
        trigger,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: LOGIN_INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const loginInfo = watch();

    const handleFieldChange = (field) => (e) => {
        setValue(field, e.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(errors[field]),
        });
    };

    const handleFieldBlur = (field) => () => {
        trigger(field);
    };

    const getFieldProps = (field) => ({
        value: loginInfo[field] ?? '',
        onChange: handleFieldChange(field),
        onBlur: handleFieldBlur(field),
        error: errors[field]?.message,
    });

    const onSubmit = async (data) => {
        try {
            setCarregando(true);

            const response = await login({
                email: data.email,
                senha: data.senha,
                rememberMe: data.rememberMe,
            });

            if (response.requiresTwoFactor) {
                setRequiresTwoFactor(true);
                return;
            }

            setToken(response.token);
            navigate('/');
        } catch (err) {
            showError(err.message || 'Erro ao realizar login.', 'Verifique as informações inseridas.');
        } finally {
            setCarregando(false);
        }
    };

    const handleVerify2FA = async () => {
        try {
            setCarregando(true);

            const response = await verifyLogin2FA({
                email: loginInfo.email,
                senha: loginInfo.senha,
                code: codigo2fa,
                rememberMe: loginInfo.rememberMe,
            });

            setToken(response.token);
            navigate('/');
        } catch (err) {
            showError(err.message || 'Código inválido.', 'Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#f6f7f9] px-6 py-6">
            <div className="w-full md:max-w-[420px]">
                <div className='text-center'>
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
                            {!requiresTwoFactor ? 'Acesso ao portal' : 'Verificação em dois fatores'}
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            {!requiresTwoFactor ? (
                                <p className="text-sm text-gray-500 text-center m-0">
                                    Não possui conta?{' '}
                                    <Link to="/cadastro" className="underline">
                                        Cadastrar
                                    </Link>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 text-center m-0">
                                    Digite o código gerado no Google Authenticator.
                                </p>
                            )}

                            <Button
                                type={!requiresTwoFactor ? "submit" : "button"}
                                form={!requiresTwoFactor ? "login-form" : undefined}
                                onClick={requiresTwoFactor ? handleVerify2FA : undefined}
                                disabled={carregando}
                            >
                                {carregando
                                    ? (requiresTwoFactor ? 'Validando...' : 'Entrando...')
                                    : (requiresTwoFactor ? 'Validar código' : 'Entrar')}
                            </Button>
                        </div>
                    }
                >
                    {!requiresTwoFactor ? (
                        <form id="login-form" onSubmit={handleSubmit(onSubmit)} className='flex gap-3 flex-col'>
                            <Input
                                label="E-mail"
                                type="email"
                                placeholder="Digite seu e-mail"
                                {...getFieldProps('email')}
                            />

                            <Input
                                label="Senha"
                                type="password"
                                placeholder="Digite sua senha"
                                {...getFieldProps('senha')}
                            />

                            <Checkbox
                                label="Lembrar de mim"
                                checked={loginInfo.rememberMe ?? false}
                                onChange={(e) => setValue('rememberMe', e.target.checked)}
                            />
                        </form>
                    ) : (
                        <div className="flex gap-3 flex-col">
                            <Input
                                label="Código do autenticador"
                                type="text"
                                placeholder="Digite o código de 6 dígitos"
                                value={codigo2fa}
                                onChange={(e) => setCodigo2fa(e.target.value)}
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setRequiresTwoFactor(false);
                                    setCodigo2fa('');
                                }}
                                disabled={carregando}
                            >
                                Voltar
                            </Button>
                        </div>
                    )}
                </Card>

                <div className="mt-4 text-sm text-gray-500 text-center">
                    Esqueceu sua senha?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/esqueci-minha-senha")}
                        className="underline bg-transparent border-none p-0 m-0 text-inherit cursor-pointer"
                    >
                        Redefinir
                    </button>
                </div>
            </div>
        </div>
    );
}