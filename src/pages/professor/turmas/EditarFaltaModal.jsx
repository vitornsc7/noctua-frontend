import React, { useEffect, useState } from 'react';
import { Button, DateInput, Input, Modal, Select } from '../../../components/UI';
import { PERIODO_LABEL } from '../../../utils/displayMaps';

const formatarDataParaInput = (data) => {
    if (!data) return '';
    return data.slice(0, 10);
};

const EditarFaltaModal = ({ isOpen, onClose, onSave, falta, turma }) => {
    const [form, setForm] = useState({
        alunoId: '',
        periodo: '',
        dataFalta: '',
        periodosFaltados: 1,
    });

    useEffect(() => {
        if (isOpen && falta) {
            setForm({
                alunoId: falta.alunoId,
                periodo: falta.periodo,
                dataFalta: formatarDataParaInput(falta.dataFalta),
                periodosFaltados: falta.periodosFaltados ?? 1,
            });
        }
    }, [isOpen, falta]);

    const handleChange = (field) => (event) => {
        setForm((current) => ({
            ...current,
            [field]: event.target.value,
        }));
    };

    const handlePeriodosFaltadosChange = (event) => {
        const value = Number(event.target.value);

        if (value < 1) {
            setForm((current) => ({ ...current, periodosFaltados: 1 }));
            return;
        }

        if (value > 6) {
            setForm((current) => ({ ...current, periodosFaltados: 6 }));
            return;
        }

        setForm((current) => ({ ...current, periodosFaltados: value }));
    };

    const periodos = Array.from(
        { length: turma?.qtdePeriodos || 0 },
        (_, index) => index + 1
    );

    const periodoLabel = PERIODO_LABEL[turma?.qtdePeriodos] ?? 'Período';

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
                        onClick={() => onSave(form)}
                        disabled={
                            !form.alunoId ||
                            !form.periodo ||
                            !form.dataFalta ||
                            !form.periodosFaltados
                        }
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

                <Select
                    label={periodoLabel}
                    required
                    placeholder={`Selecione o ${periodoLabel.toLowerCase()}`}
                    value={form.periodo}
                    onChange={handleChange('periodo')}
                    fullWidth
                >
                    {periodos.map((periodo) => (
                        <Select.Option key={periodo} value={periodo}>
                            {periodo}º {periodoLabel}
                        </Select.Option>
                    ))}
                </Select>

                <DateInput
                    label="Data da falta"
                    required
                    value={form.dataFalta}
                    onChange={handleChange('dataFalta')}
                    fullWidth
                />

                <Input
                    label="Períodos faltados"
                    type="number"
                    min={1}
                    max={6}
                    value={form.periodosFaltados}
                    onChange={handlePeriodosFaltadosChange}
                    fullWidth
                    tooltip="Informe a quantidade de aulas que o aluno perdeu nesta data."
                />
            </div>
        </Modal>
    );
};

export default EditarFaltaModal;