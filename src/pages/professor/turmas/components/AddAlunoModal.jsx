import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, Select, Tooltip } from '../../../../components/UI';
import { ALUNO_INITIAL_VALUES, MATRICULA_OPTIONS, alunoSchema } from '../cadastroTurmaSchema';

const AddAlunoModal = ({
    isOpen,
    isEditing,
    isLoading,
    initialData,
    onClose,
    onSave,
}) => {
    const {
        register,
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(alunoSchema),
        defaultValues: ALUNO_INITIAL_VALUES,
        mode: 'onBlur',
    });

    useEffect(() => {
        if (isOpen) {
            reset(initialData || ALUNO_INITIAL_VALUES);
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = (values) => {
        onSave?.({
            nome: values.nome?.trim() || '',
            observacao: values.observacao?.trim() || '',
            ativo: values.ativo ?? 'ativa',
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar aluno' : 'Adicionar aluno'}
            maxWidth="max-w-md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        leftIcon={isLoading ? <i className="pi pi-spin pi-spinner text-xs" /> : undefined}
                    >
                        {isEditing ? 'Salvar' : 'Adicionar'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <Input
                    label="Nome do aluno"
                    required
                    placeholder="Digite o nome completo"
                    error={errors.nome?.message}
                    fullWidth
                    {...register('nome')}
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Observação
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Observações sobre o aluno..."
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                        {...register('observacao')}
                    />
                    {errors.observacao?.message && (
                        <p className="text-xs text-red-600">
                            {errors.observacao.message}
                        </p>
                    )}
                </div>

                {isEditing && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-700">Matrícula</span>
                            <Tooltip content="Isto não excluirá o aluno de avaliações em que já realizou, apenas deixará de mostrá-lo na criação de novas avaliações e na listagem principal dos alunos.">
                                <i className="pi pi-info-circle text-xs text-gray-400 cursor-default" />
                            </Tooltip>
                        </div>
                        <Controller
                            name="ativo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    fullWidth
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                >
                                    {MATRICULA_OPTIONS.map((opt) => (
                                        <Select.Option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

AddAlunoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool,
    isLoading: PropTypes.bool,
    initialData: PropTypes.shape({
        nome: PropTypes.string,
        observacao: PropTypes.string,
        ativo: PropTypes.string,
    }),
    onClose: PropTypes.func,
    onSave: PropTypes.func,
};

AddAlunoModal.defaultProps = {
    isEditing: false,
    initialData: ALUNO_INITIAL_VALUES,
};

export default AddAlunoModal;