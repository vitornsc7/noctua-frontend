import { z } from 'zod';

export const PERIODICIDADE_OPTIONS = ['Bimestre', 'Trimestre'];
export const TURNO_OPTIONS = ['Matutino', 'Vespertino', 'Noturno', 'Integral'];

export const TURMA_INITIAL_VALUES = {
    nome: '',
    periodicidade: '',
    anoLetivo: '',
    turno: '',
    disciplina: '',
    mediaMinima: '',
    instituicao: '',
};

export const ALUNO_INITIAL_VALUES = {
    nome: '',
    descricao: '',
};

export const TURMA_STEP_ONE_FIELDS = [
    'nome',
    'periodicidade',
    'anoLetivo',
    'turno',
    'disciplina',
    'mediaMinima',
    'instituicao',
];

export const turmaSchema = z.object({
    nome: z.string().trim()
        .min(1, 'Informe o nome da turma.')
        .min(3, 'O nome da turma precisa ter pelo menos 3 caracteres.'),
    periodicidade: z.string().trim()
        .min(1, 'Selecione a periodicidade da turma.')
        .refine((value) => PERIODICIDADE_OPTIONS.includes(value), {
            message: 'Periodicidade inválida. Use Bimestre ou Trimestre.',
        }),
    anoLetivo: z.string().trim()
        .min(1, 'Informe o ano letivo.')
        .regex(/^\d{4}$/, 'Informe o ano letivo com 4 dígitos (ex: 2026).')
        .refine((value) => {
            const year = Number(value);
            return year >= 2000 && year <= 2100;
        }, {
            message: 'Ano letivo fora do intervalo permitido (2000 a 2100).',
        }),
    turno: z.string().trim()
        .min(1, 'Selecione o turno da turma.')
        .refine((value) => TURNO_OPTIONS.includes(value), {
            message: 'Turno inválido. Use Matutino, Vespertino, Noturno ou Integral.',
        }),
    disciplina: z.string().trim().optional().or(z.literal(''))
        .refine((value) => value.length === 0 || value.length >= 2, {
            message: 'A disciplina deve ter pelo menos 2 caracteres.',
        }),
    mediaMinima: z.string().trim()
        .min(1, 'Informe a média mínima da turma.')
        .regex(/^\d+(\.\d+)?$/, 'A média mínima deve ser numérica.')
        .refine((value) => {
            const grade = Number(value);
            return !Number.isNaN(grade) && grade >= 0 && grade <= 10;
        }, {
            message: 'A média mínima deve estar entre 0 e 10.',
        }),
    instituicao: z.string().trim().optional().or(z.literal(''))
        .refine((value) => value.length === 0 || value.length >= 3, {
            message: 'A instituição deve ter pelo menos 3 caracteres.',
        }),
});

export const alunoSchema = z.object({
    nome: z.string().trim()
        .min(1, 'Informe o nome do aluno.')
        .min(3, 'O nome do aluno precisa ter pelo menos 3 caracteres.'),
    descricao: z.string().trim()
        .max(280, 'A descrição pode ter no máximo 280 caracteres.')
        .optional()
        .or(z.literal('')),
});
