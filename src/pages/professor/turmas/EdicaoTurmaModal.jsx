import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Input, Select, Button } from '../../../components/UI';
import {
    TURNO_OPTIONS,
    turmaSchema,
} from './cadastroTurmaSchema';

const extrairAno = (anoLetivo) => {
    if (!anoLetivo) return '';
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    if (Array.isArray(anoLetivo)) return String(anoLetivo[0]);
    return String(anoLetivo);
};

const PERIODICIDADE_FROM_QTDE = { 4: 'Bimestral', 3: 'Trimestral' };
const PERIODICIDADE_TO_QTDE = { Bimestral: 4, Trimestral: 3 };

const TURNO_DISPLAY = {
    MATUTINO: 'Matutino',
    VESPERTINO: 'Vespertino',
    NOTURNO: 'Noturno',
    INTEGRAL: 'Integral',
};
const TURNO_FROM_ENUM = (enumValue) => TURNO_DISPLAY[enumValue] ?? enumValue;

const EdicaoTurmaModal = ({ isOpen, onClose, turma, onSave }) => {
    const {
        watch,
        setValue,
        trigger,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(turmaSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const form = watch();

    useEffect(() => {
        if (isOpen && turma) {
            reset({
                nome: turma.nome || '',
                periodicidade: PERIODICIDADE_FROM_QTDE[turma.qtdePeriodos] || '',
                anoLetivo: extrairAno(turma.anoLetivo),
                turno: TURNO_FROM_ENUM(turma.turno),
                qtdeAulasPrevistasPeriodo: String(turma.qtdeAulasPrevistasPeriodo || ''),
                mediaMinima: String(turma.mediaMinima ?? ''),
                disciplina: turma.disciplina || '',
                instituicao: turma.instituicao || '',
            });
        }
    }, [isOpen, turma, reset]);

    const getFieldProps = (field) => ({
        value: form[field] ?? '',
        onChange: (e) => {
            setValue(field, e.target.value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: Boolean(errors[field]),
            });
        },
        onBlur: () => trigger(field),
        error: errors[field]?.message,
    });

    const handleSubmit = async () => {
        const valid = await trigger();
        if (!valid) return;

        onSave({
            nome: form.nome,
            anoLetivo: `${form.anoLetivo}-01-01`,
            qtdePeriodos: PERIODICIDADE_TO_QTDE[form.periodicidade],
            qtdeAulasPrevistasPeriodo: Number(form.qtdeAulasPrevistasPeriodo),
            turno: Object.keys(TURNO_DISPLAY).find((k) => TURNO_DISPLAY[k] === form.turno) ?? form.turno,
            mediaMinima: parseFloat(form.mediaMinima),
            disciplina: form.disciplina?.trim() || null,
            instituicao: form.instituicao?.trim() || null,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar turma"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input
                        label="Nome da turma"
                        required
                        placeholder="Ex: 6º Ano - A"
                        fullWidth
                        {...getFieldProps('nome')}
                    />
                    <Input
                        label="Ano letivo"
                        required
                        placeholder="Ex: 2026"
                        integerOnly
                        maxChars={4}
                        fullWidth
                        {...getFieldProps('anoLetivo')}
                    />
                    <Select
                        label="Turno"
                        required
                        placeholder="Selecione"
                        fullWidth
                        {...getFieldProps('turno')}
                    >
                        {TURNO_OPTIONS.map((opt) => (
                            <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                        ))}
                    </Select>
                    <Input
                        label="Aulas previstas por período"
                        required
                        placeholder="Ex: 20"
                        integerOnly
                        maxChars={3}
                        fullWidth
                        {...getFieldProps('qtdeAulasPrevistasPeriodo')}
                    />
                    <Input
                        label="Média mínima"
                        required
                        placeholder="Ex: 7.0"
                        numericOnly
                        maxChars={4}
                        fullWidth
                        {...getFieldProps('mediaMinima')}
                    />
                    <Input
                        label="Disciplina"
                        placeholder="Ex: Matemática"
                        fullWidth
                        {...getFieldProps('disciplina')}
                    />
                </div>
                <Input
                    label="Instituição"
                    placeholder="Ex: Escola Estadual João da Silva"
                    fullWidth
                    {...getFieldProps('instituicao')}
                />
            </div>
        </Modal>
    );
};

export default EdicaoTurmaModal;
