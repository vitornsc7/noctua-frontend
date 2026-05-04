import { z } from 'zod';

export const PERIODICIDADE_OPTIONS = ['Bimestral', 'Trimestral'];
export const TURNO_OPTIONS = ['Matutino', 'Vespertino', 'Noturno', 'Integral'];

export const TURMA_INITIAL_VALUES = {
    nome: '',
    periodicidade: '',
    anoLetivo: String(new Date().getFullYear()),
    turno: '',
    disciplina: '',
    mediaMinima: '7.0',
    qtdeAulasPrevistasPeriodo: '',
    instituicao: '',
};

export const ALUNO_INITIAL_VALUES = {
    nome: '',
    observacao: '',
    ativo: 'ativa',
};

export const TURMA_STEP_ONE_FIELDS = [
    'nome',
    'periodicidade',
    'anoLetivo',
    'turno',
    'disciplina',
    'mediaMinima',
    'qtdeAulasPrevistasPeriodo',
    'instituicao',
];

export const turmaSchema = z.object({
    nome: z.string().trim()
        .min(1, 'Informe o nome da turma.')
        .min(3, 'O nome da turma precisa ter pelo menos 3 caracteres.'),
    periodicidade: z.string().trim()
        .min(1, 'Selecione a periodicidade da turma.')
        .refine((value) => PERIODICIDADE_OPTIONS.includes(value), {
            message: 'Periodicidade inválida. Use Bimestral ou Trimestral.',
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
    qtdeAulasPrevistasPeriodo: z.string().trim()
        .min(1, 'Informe a quantidade de aulas previstas por período.')
        .regex(/^\d+$/, 'Informe um número inteiro.')
        .refine((value) => {
            const num = Number(value);
            return num >= 1 && num <= 200;
        }, {
            message: 'A quantidade de aulas deve ser entre 1 e 200.',
        }),
    instituicao: z.string().trim().optional().or(z.literal(''))
        .refine((value) => value.length === 0 || value.length >= 3, {
            message: 'A instituição deve ter pelo menos 3 caracteres.',
        }),
});

export const MATRICULA_OPTIONS = [
    { value: 'ativa', label: 'Ativa' },
    { value: 'inativa', label: 'Inativa' },
];

export const alunoSchema = z.object({
    nome: z.string().trim()
        .min(1, 'Informe o nome do aluno.')
        .min(3, 'O nome do aluno precisa ter pelo menos 3 caracteres.'),
    observacao: z.string().trim()
        .max(280, 'A observação pode ter no máximo 280 caracteres.')
        .optional()
        .or(z.literal('')),
    ativo: z.enum(['ativa', 'inativa']).optional(),
});
