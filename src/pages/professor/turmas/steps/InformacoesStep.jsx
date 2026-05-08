import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Input, Select } from '../../../../components/UI';
import { PERIODICIDADE_OPTIONS, TURNO_OPTIONS } from '../cadastroTurmaSchema';

const InformacoesStep = ({ getTurmaFieldProps, isCloningTurma, isSubmitting, isEditing, onSubmit, onCancel, isCancelling }) => {
    const label = isEditing ? 'Editar turma' : 'Criar turma';

    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isCloningTurma || isCancelling}
                leftIcon={isCancelling ? <i className="pi pi-spin pi-spinner text-xs" /> : undefined}
            >
                Cancelar
            </Button>
            <Button
                variant="primary"
                onClick={onSubmit}
                disabled={isSubmitting || isCloningTurma || isCancelling}
                leftIcon={isSubmitting ? <i className="pi pi-spin pi-spinner text-xs" /> : undefined}
            >
                {label}
            </Button>
        </div>
    );

    return (
        <Card
            footer={footer}
            header={<h2 className="text-lg font-medium text-gray-700">Informações gerais</h2>}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    label="Nome da turma"
                    required
                    placeholder="Ex: 6º Ano - 9A"
                    {...getTurmaFieldProps('nome')}
                    fullWidth
                />

                <Select
                    label="Periodicidade"
                    required
                    placeholder="Selecione"
                    {...getTurmaFieldProps('periodicidade')}
                    fullWidth
                >
                    {PERIODICIDADE_OPTIONS.map((option) => (
                        <Select.Option key={option} value={option}>{option}</Select.Option>
                    ))}
                </Select>

                <Input
                    label="Ano letivo"
                    required
                    placeholder="Ex: 2026"
                    {...getTurmaFieldProps('anoLetivo')}
                    integerOnly
                    maxChars={4}
                    fullWidth
                />

                <Select
                    label="Turno"
                    required
                    placeholder="Selecione"
                    {...getTurmaFieldProps('turno')}
                    fullWidth
                >
                    {TURNO_OPTIONS.map((option) => (
                        <Select.Option key={option} value={option}>{option}</Select.Option>
                    ))}
                </Select>

                <Input
                    label="Aulas previstas por período"
                    required
                    placeholder="Ex: 20"
                    {...getTurmaFieldProps('qtdeAulasPrevistasPeriodo')}
                    integerOnly
                    maxChars={3}
                    fullWidth
                />

                <Input
                    label="Média mínima"
                    required
                    tooltip="Média mínima da instituição, utilizada no cálculo da matriz de intervenção."
                    placeholder="Ex: 7.0"
                    {...getTurmaFieldProps('mediaMinima')}
                    numericOnly
                    maxChars={4}
                    fullWidth
                />

                <Input
                    label="Disciplina"
                    placeholder="Ex: Matemática"
                    {...getTurmaFieldProps('disciplina')}
                    fullWidth
                />

                <Input
                    label="Instituição"
                    placeholder="Ex: Escola Estadual João da Silva"
                    {...getTurmaFieldProps('instituicao')}
                    fullWidth
                />
            </div>
        </Card>
    );
};

InformacoesStep.propTypes = {
    getTurmaFieldProps: PropTypes.func.isRequired,
    isCloningTurma: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isEditing: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isCancelling: PropTypes.bool,
};

export default InformacoesStep;
