import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Pageable, Tag } from '../../../../components/UI';

const PAGE_SIZE = 25;

const VisaoGeralStep = ({ turmaInfo, turmaOverviewFields, alunos, onBack, onFinish }) => {
    const [page, setPage] = useState(0);
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
                        <>
                            <ul className="grid grid-cols-5 gap-2">
                                {alunos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((aluno) => (
                                    <li
                                        key={aluno.id}
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                                    >
                                        <i className="pi pi-user shrink-0 text-xs text-gray-500" />
                                        <p className="truncate text-sm font-medium text-gray-700" title={aluno.nome}>
                                            {aluno.nome}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            {alunos.length > PAGE_SIZE && (
                                <Pageable
                                    className="mt-3"
                                    page={page}
                                    pageSize={PAGE_SIZE}
                                    totalItems={alunos.length}
                                    onPageChange={setPage}
                                />
                            )}
                        </>
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
