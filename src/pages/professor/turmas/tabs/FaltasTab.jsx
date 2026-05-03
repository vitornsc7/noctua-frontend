import React, { useEffect, useState } from 'react';
import { listarFaltasPorTurma } from '../../../../api/turmaApi';
import { Table } from '../../../../components/UI';

const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
};

const FaltasTab = ({ turma }) => {
    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!turma?.id) return;

        setLoading(true);

        listarFaltasPorTurma(turma.id)
            .then(setFaltas)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [turma?.id]);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Faltas</h2>

            <Table
                data={faltas}
                loading={loading}
                emptyMessage="Nenhuma falta cadastrada."
            >
                <Table.Column
                    header="Aluno"
                    render={(falta) => `Aluno ID: ${falta.alunoId}`}
                />

                <Table.Column
                    header="Período"
                    accessor="periodo"
                />

                <Table.Column
                    header="Data da falta"
                    render={(falta) => formatarData(falta.dataFalta)}
                />
            </Table>
        </div>
    );
};

export default FaltasTab;