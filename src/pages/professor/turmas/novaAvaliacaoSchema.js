import { z } from 'zod';

export const TIPOS_AVALIACAO = ['Prova', 'Trabalho', 'Atividade', 'Recuperação'];

export const AVALIACAO_INITIAL_VALUES = {
    tipo: 'Prova',
    peso: '1',
    tema: '',
    data: '',
    periodo: '',
};

export const novaAvaliacaoSchema = z.object({
    tipo: z.string().trim()
        .refine((v) => TIPOS_AVALIACAO.includes(v), { message: 'Selecione um tipo de avaliação válido.' }),
    peso: z.string().trim()
        .min(1, 'Informe o peso da avaliação.')
        .regex(/^\d+$/, 'O peso deve ser um número inteiro.')
        .refine((v) => Number(v) >= 1 && Number(v) <= 10, { message: 'O peso deve estar entre 1 e 10.' }),
    tema: z.string().trim()
        .min(1, 'Informe o tema da avaliação.')
        .min(3, 'O tema deve ter pelo menos 3 caracteres.'),
    data: z.string().trim()
        .min(1, 'Informe a data de aplicação.'),
    periodo: z.string().trim()
        .min(1, 'Selecione o período.'),
});
