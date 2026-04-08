import { z } from 'zod';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOGIN_INITIAL_VALUES = {
    email: '',
    senha: '',
    rememberMe: false,
};

export const REGISTER_INITIAL_VALUES = {
    nome: '',
    email: '',
    cpf: '',
    senha: '',
};

export const loginSchema = z.object({
    email: z.string().trim()
        .min(1, 'Informe o e-mail.')
        .regex(EMAIL_REGEX, 'Informe um e-mail válido.'),
    senha: z.string()
        .min(1, 'Informe a senha.'),
});

export const registerSchema = z.object({
    nome: z.string().trim()
        .min(1, 'Informe o nome completo.')
        .min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
    email: z.string().trim()
        .min(1, 'Informe o e-mail.')
        .regex(EMAIL_REGEX, 'Informe um e-mail válido.'),
    cpf: z.string().trim()
        .min(1, 'Informe o CPF.')
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Informe um CPF válido (ex: 123.456.789-01).'),
    senha: z.string()
        .min(1, 'Informe a senha.')
        .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});
