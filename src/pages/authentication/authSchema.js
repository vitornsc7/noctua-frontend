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
    senha: '',
};

export const EDIT_USER_INITIAL_VALUES = {
    nome: '',
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
    nome: z
        .string()
        .trim()
        .refine((value) => {
            const partes = value.split(/\s+/);
            return partes.length >= 2 && partes.every((parte) => parte.length >= 3);
        }, 'Informe nome e sobrenome, ambos com pelo menos 3 letras.'),
    email: z.string().trim()
        .min(1, 'Informe o e-mail.')
        .regex(EMAIL_REGEX, 'Informe um e-mail válido.'),
    senha: z
        .string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres.')
        .regex(/\d/, 'A senha deve conter pelo menos 1 número.'),
});

export const editUserSchema = z.object({
    nome: z
        .string()
        .trim()
        .refine((value) => {
            const partes = value.split(/\s+/);
            return partes.length >= 2 && partes.every((parte) => parte.length >= 3);
        }, 'Informe nome e sobrenome, ambos com pelo menos 3 letras.'),

    senha: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || value.length >= 8, {
            message: 'A senha deve ter pelo menos 8 caracteres.',
        })
        .refine((value) => !value || /\d/.test(value), {
            message: 'A senha deve conter pelo menos 1 número.',
        }),
});