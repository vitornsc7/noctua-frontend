import React, { useEffect, useState } from 'react';
import { Button, DateInput, Input, Modal, Select, Tooltip } from '../../../components/UI';

const formatarDataParaInput = (data) => {
    if (!data) return '';
    return data.slice(0, 10);
};

const EditarFaltaModal = ({ isOpen, onClose, onSave, falta, turma }) => {
    const [isSaving, setIsSaving] = useState(false);
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
        setForm((current) => ({ ...current, periodosFaltados: event.target.value }));
    };

    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);

    const isTrimestral = qtdePeriodosTurma === 3;

    const quantidadePeriodos = isTrimestral ? 3 : 4;

    const periodoLabel = isTrimestral ? 'Trimestre' : 'Bimestre';

    const periodos = Array.from(
        { length: quantidadePeriodos },
        (_, index) => index + 1
    );

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
                        onClick={async () => {
                            setIsSaving(true);
                            try {
                                await onSave(form);
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        disabled={
                            isSaving ||
                            !form.alunoId ||
                            !form.periodo ||
                            !form.dataFalta ||
                            !form.periodosFaltados
                        }
                        isLoading={isSaving}
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
                    disabled
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
                    disabled
                    fullWidth
                    tooltip="O período só pode ser alterado na tela de lançamento de faltas."
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
                    disabled
                    value={form.dataFalta}
                    onChange={handleChange('dataFalta')}
                    fullWidth
                />

                <Input
                    label="Períodos faltados"
                    integerOnly
                    required
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