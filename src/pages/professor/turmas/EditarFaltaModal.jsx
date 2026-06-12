import React, { useEffect, useState } from 'react';
import { Button, DateInput, Input, Modal, Select } from '../../../components/UI';

const formatarDataParaInput = (data) => {
    if (!data) return '';
    return data.slice(0, 10);
};

const formatarDataDisplay = (data) => {
    if (!data) return '-';
    const iso = data.slice(0, 10);
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
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

    const handlePeriodosFaltadosChange = (event) => {
        setForm((current) => ({ ...current, periodosFaltados: event.target.value }));
    };

    const qtdePeriodosTurma = Number(turma?.qtdePeriodos);
    const isTrimestral = qtdePeriodosTurma === 3;
    const periodoLabel = isTrimestral ? 'Trimestre' : 'Bimestre';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Editar falta (${formatarDataDisplay(form.dataFalta)})`}
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
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Aluno</p>
                    <p className="text-sm text-gray-700">{falta?.alunoNome ?? '-'}</p>
                </div>

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