import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Tag } from '../../../../components/UI';

const VisaoGeralStep = ({ turmaInfo, turmaOverviewFields, alunos, onBack, onFinish }) => {
    const footer = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onBack}>
                Voltar
            </Button>
            <Button variant="primary" onClick={onFinish}>
                Finalizar
            </Button>
        </div>
    );

    return (
        <Card
            footer={footer}
            header={<h2 className="text-lg font-medium text-gray-700">Informações da turma</h2>}
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm mb-2 font-normal text-gray-700">
                        Turma: <span className="text-primary">{turmaInfo.nome}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {turmaOverviewFields.map(({ label, value }) => (
                            <div key={label}>
                                <Tag className="text-sm font-medium text-gray-700">
                                    {label === 'Média Mínima'
                                        ? `Média mínima: ${value}`
                                        : label === 'Aulas por período'
                                            ? `Aulas por período: ${value}`
                                            : value}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm mb-2 font-normal text-gray-700">
                        Alunos <span className="text-primary">({alunos.length})</span>
                    </h3>

                    {alunos.length === 0 ? (
                        <p className="text-sm italic text-gray-400">
                            Nenhum aluno adicionado.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {alunos.map((aluno) => (
                                <li
                                    key={aluno.id}
                                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            <i className="pi pi-user text-xs" /> {aluno.nome}
                                        </p>
                                        {aluno.observacao && (
                                            <p className="text-xs text-gray-400">
                                                {aluno.observacao}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Card>
    );
};

VisaoGeralStep.propTypes = {
    turmaInfo: PropTypes.object.isRequired,
    turmaOverviewFields: PropTypes.array.isRequired,
    alunos: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
};

export default VisaoGeralStep;
