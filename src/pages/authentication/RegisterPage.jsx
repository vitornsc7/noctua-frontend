import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from '../../components/UI';
import corujinha from '../../assets/corujinha.png';
import { registerSchema, REGISTER_INITIAL_VALUES } from './authSchema';

export default function RegisterPage() {
    const [carregando, setCarregando] = useState(false);

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

    const onSubmit = (data) => {
        console.log('Cadastro:', data);
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

                <Card variant="accent"
                    header={
                        <h2 className="text-lg font-medium text-gray-700">Criar conta</h2>
                    }
                    footer={
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Já possui conta?{' '}
                                <Link to="/login" className="underline">
                                    Logar
                                </Link>
                            </p>
                            <Button
                                type="submit"
                                form="register-form"
                                disabled={carregando}
                            >
                                {carregando ? 'Cadastrando...' : 'Cadastrar'}
                            </Button>
                        </div>
                    }
                >
                    <form id="register-form" onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
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
                            label="CPF"
                            type="text"
                            mask="***.***.***-**"
                            placeholder="Digite seu CPF"
                            {...getFieldProps('cpf')}
                        />

                        <Input
                            label="Senha"
                            type="password"
                            placeholder="Digite sua senha"
                            {...getFieldProps('senha')}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
}