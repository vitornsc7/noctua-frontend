import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Checkbox, Input, Modal } from '../../../components/UI';

const editarNotaSchema = z
    .object({
        naoRealizada: z.boolean(),
        valor: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.naoRealizada) return;

        const trimmed = (data.valor ?? '').trim();
        if (!trimmed) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['valor'],
                message: 'Informe a nota.',
            });
            return;
        }

        const num = parseFloat(trimmed.replace(',', '.'));
        if (Number.isNaN(num) || num < 0 || num > 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['valor'],
                message: 'A nota deve estar entre 0 e 10.',
            });
        }
    });

const INITIAL_VALUES = { naoRealizada: false, valor: '' };

const EditarNotaModal = ({ isOpen, onClose, onSave, nota, saving, temChamadaFilha = false }) => {
    const {
        watch,
        setValue,
        trigger,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editarNotaSchema),
        defaultValues: INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const naoRealizada = watch('naoRealizada');
    const valor = watch('valor');
    const isNaoRealizadaAtual = nota?.naoRealizada ?? false;
    const temValorAtual = nota?.valor != null;
    const checkboxDisabled = temChamadaFilha && (isNaoRealizadaAtual || temValorAtual);
    const valorDisabled = temChamadaFilha && isNaoRealizadaAtual;

    useEffect(() => {
        if (isOpen && nota) {
            reset({
                naoRealizada: nota.naoRealizada ?? false,
                valor: nota.valor != null ? Number(nota.valor).toFixed(2).replace('.', ',') : '',
            });
        }
        if (!isOpen) {
            reset(INITIAL_VALUES);
        }
    }, [isOpen, nota, reset]);

    const handleNaoRealizadaChange = (e) => {
        setValue('naoRealizada', e.target.checked, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
        if (e.target.checked) {
            setValue('valor', '', { shouldDirty: true });
        }
    };

    const handleValorChange = (e) => {
        setValue('valor', e.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(errors.valor),
        });
    };

    const onSubmit = (data) => {
        onSave({
            valor: data.naoRealizada ? 0 : parseFloat(String(data.valor).replace(',', '.')),
            naoRealizada: data.naoRealizada,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar nota do(a) aluno(a)"
            maxWidth="max-w-md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={saving}
                    >
                        {saving && <i className="pi pi-spin pi-spinner text-xs" />}
                        Salvar
                    </Button>
                </div>
            }
        >
            <div className="space-y-3">
                <Input
                    label="Aluno"
                    value={nota?.alunoNome ?? ''}
                    disabled
                    fullWidth
                />

                <Checkbox
                    label="Aluno não compareceu na realização da prova"
                    tooltip={checkboxDisabled ? "Aluno associado à uma nova chamada." : undefined}
                    checked={naoRealizada}
                    onChange={handleNaoRealizadaChange}
                    disabled={checkboxDisabled}
                />

                {!naoRealizada && (
                    <Input
                        label="Nota"
                        required
                        numericOnly
                        maxIntegerDigits={2}
                        maxDecimalDigits={2}
                        min={0}
                        max={10}
                        value={valor}
                        onChange={handleValorChange}
                        onBlur={() => trigger('valor')}
                        error={errors.valor?.message}
                        fullWidth
                        placeholder="0 a 10"
                        disabled={valorDisabled}
                    />
                )}
            </div>
        </Modal>
    );
};

export default EditarNotaModal;
