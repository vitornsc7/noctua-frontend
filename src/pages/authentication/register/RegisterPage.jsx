import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button, useToast, Checkbox } from '../../../components/UI';
import corujinha from '../../../assets/noctua.svg';
import { registerSchema, REGISTER_INITIAL_VALUES } from '../authSchema';
import { register } from '../../../api/authApi';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [carregando, setCarregando] = useState(false);
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [politicaAceita, setPoliticaAceita] = useState(false);

    const {
        watch,
        setValue,
        trigger,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: REGISTER_INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const registerInfo = watch();

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
        value: registerInfo[field] ?? '',
        onChange: handleFieldChange(field),
        onBlur: handleFieldBlur(field),
        error: errors[field]?.message,
    });

    const onSubmit = async (data) => {
        try {
            setCarregando(true);

            await register(data);

            showSuccess('Conta criada com sucesso!', 'Faça login para acessar o portal.');
            navigate('/login');
        } catch (error) {
            showError(error.message || 'Erro ao cadastrar usuário.', 'Verifique os dados e tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#f6f7f9] px-6 py-6">
            <div className="w-full md:max-w-[420px]">
                <div className="text-center">
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
                    <p className="mt-2 mb-5 text-sm text-gray-500">
                        <span className="italic">Insights</span> poderosos que mudam a educação.
                    </p>
                </div>

                <Card
                    className="max-w-[380px] mx-auto"
                    header={
                        <h2 className="text-lg font-medium text-gray-700">
                            Criar conta
                        </h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Já possui conta?{' '}
                                <Link to="/login" className="underline focus:outline-none focus:font-bold focus:text-secondary">
                                    Logar
                                </Link>
                            </p>

                            <Button
                                type="submit"
                                form="register-form"
                                disabled={carregando || !termosAceitos || !politicaAceita}
                                isLoading={carregando}
                            >
                                Cadastrar
                            </Button>
                        </div>
                    }
                >
                    <form
                        id="register-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-3"
                    >
                        <Input
                            label="Nome"
                            type="text"
                            placeholder="Digite seu nome completo"
                            {...getFieldProps('nome')}
                        />

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
                    </form>
                    <Checkbox
                        className="mt-4"
                        label={<span>Aceito os <Link target="_blank" to="/termos-de-uso" className="underline outline-none focus:outline-none focus:font-bold focus:text-secondary">termos de uso</Link></span>}
                        checked={termosAceitos ?? false}

                        onChange={(e) => setTermosAceitos(e.target.checked)}
                    />
                    <Checkbox
                        className="mt-1"
                        label={<span>Li e concordo com a <Link target="_blank" to="/politica-de-privacidade" className="underline outline-none focus:outline-none focus:font-bold focus:text-secondary">política de privacidade</Link></span>}
                        checked={politicaAceita ?? false}
                        onChange={(e) => setPoliticaAceita(e.target.checked)}
                    />
                </Card>
            </div>
        </div>
    );
}