import React, { useEffect, useState } from 'react';
import { Button, DateInput, Input, Modal, Select } from '../../../components/UI';

const formatarDataParaInput = (data) => {
    if (!data) return '';
    return data.slice(0, 10);
};

const EditarFaltaModal = ({ isOpen, onClose, onSave, falta, turma }) => {
    const [form, setForm] = useState({
        alunoId: '',
        periodo: '',
        dataFalta: '',
    });

    useEffect(() => {
        if (isOpen && falta) {
            setForm({
                alunoId: falta.alunoId,
                periodo: falta.periodo,
                dataFalta: formatarDataParaInput(falta.dataFalta),
            });
        }
    }, [isOpen, falta]);

    const handleChange = (field) => (event) => {
        setForm((current) => ({
            ...current,
            [field]: event.target.value,
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar falta"
            maxWidth="max-w-md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                            onSave({
                                ...form,
                                periodo: Number(form.periodo),
                            })
                        }
                        disabled={!form.alunoId || !form.periodo || !form.dataFalta}
                    >
                        Salvar
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <Select
                    label="Aluno"
                    required
                    placeholder="Selecione o aluno"
                    value={form.alunoId}
                    onChange={handleChange('alunoId')}
                    fullWidth
                >
                    {(turma?.alunos || []).map((aluno) => (
                        <Select.Option key={aluno.id} value={aluno.id}>
                            {aluno.nome}
                        </Select.Option>
                    ))}
                </Select>

                <Input
                    label="Períodos faltados"
                    type="text"
                    required
                    integerOnly
                    min={1}
                    max={6}
                    value={form.periodo}
                    onChange={handleChange('periodo')}
                    fullWidth
                />

                <DateInput
                    label="Data da falta"
                    required
                    value={form.dataFalta}
                    onChange={handleChange('dataFalta')}
                    fullWidth
                />
            </div>
        </Modal>
    );
};

export default EditarFaltaModal;