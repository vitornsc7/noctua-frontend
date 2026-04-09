import React from 'react';
import { Table } from '../../../../components/UI';

const AlunosTab = ({ turma }) => {
    const alunos = (turma?.alunos ?? [])
        .filter((a) => a.ativo)
        .sort((a, b) => a.nome.localeCompare(b.nome));

    return (
        <Table
            data={alunos}
            rowKey="id"
            emptyMessage="Nenhum aluno cadastrado nesta turma."
        >
            <Table.Column header="Nome" accessor="nome" />
            <Table.Column header="Observação" accessor="observacao" />
        </Table>
    );
};

export default AlunosTab;
