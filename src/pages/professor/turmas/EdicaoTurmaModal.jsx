import React, { useEffect, useState } from 'react';
import { Modal, Input, Select, Button } from '../../../components/UI';

const opcoesPeriodicidade = [
    { label: 'Bimestral', value: 4 },
    { label: 'Trimestral', value: 3 },
];

const opcoesTurno = [
    { label: 'Matutino', value: 'MATUTINO' },
    { label: 'Vespertino', value: 'VESPERTINO' },
    { label: 'Noturno', value: 'NOTURNO' },
    { label: 'Integral', value: 'INTEGRAL' },
];

const extrairAno = (anoLetivo) => {
    if (!anoLetivo) return '';
    if (typeof anoLetivo === 'string') return anoLetivo.slice(0, 4);
    return '';
};

const EdicaoTurmaModal = ({ isOpen, onClose, turma, onSave }) => {
    const [form, setForm] = useState({
        nome: '',
        anoLetivo: '',
        qtdeAulasPrevistasPeriodo: '',
        qtdePeriodos: '',
        turno: '',
    });

    useEffect(() => {
        if (turma) {
            setForm({
                nome: turma.nome || '',
                anoLetivo: extrairAno(turma.anoLetivo),
                qtdeAulasPrevistasPeriodo: turma.qtdeAulasPrevistasPeriodo || '',
                qtdePeriodos: turma.qtdePeriodos || '',
                turno: turma.turno || '',
            });
        }
    }, [turma]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const payload = {
            nome: form.nome,
            anoLetivo: `${form.anoLetivo}-01-01`,
            qtdeAulasPrevistasPeriodo: Number(form.qtdeAulasPrevistasPeriodo),
            qtdePeriodos: Number(form.qtdePeriodos),
            turno: form.turno,
        };

        onSave(payload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar turma"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                    label="Nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleInputChange}
                    placeholder="Turma A"
                />

                <Input
                    label="Ano letivo"
                    name="anoLetivo"
                    type="number"
                    value={form.anoLetivo}
                    onChange={handleInputChange}
                    placeholder="2026"
                />

                <Input
                    label="Aulas esperadas por período"
                    name="qtdeAulasPrevistasPeriodo"
                    type="number"
                    value={form.qtdeAulasPrevistasPeriodo}
                    onChange={handleInputChange}
                    placeholder="20"
                />

                <Select
                    label="Periodicidade"
                    value={form.qtdePeriodos}
                    onChange={(value) => handleSelectChange('qtdePeriodos', value)}
                    options={opcoesPeriodicidade}
                    placeholder="Selecione"
                />

                <Select
                    label="Turno"
                    value={form.turno}
                    onChange={(value) => handleSelectChange('turno', value)}
                    options={opcoesTurno}
                    placeholder="Selecione"
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>

                    <Button onClick={handleSubmit}>
                        Salvar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EdicaoTurmaModal;