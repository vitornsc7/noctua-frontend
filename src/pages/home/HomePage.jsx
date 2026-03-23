import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Tooltip, useToast } from '../../components/UI';
import HomeCreateTurmaModal from './components/CreateTurmaModal';

const demoRows = [
    {
        id: 1,
        turma: 'Matematica 101',
        professor: 'Julio Cesar',
        turno: 'Matutino',
        alunos: 32,
        observacao: 'Turma com reforco aos sabados para alunos com dificuldade em algebra.',
    },
    {
        id: 2,
        turma: 'Fisica Basica',
        professor: 'Ana Luiza',
        turno: 'Vespertino',
        alunos: 26,
        observacao: 'Conteudo focado em mecanica e revisao semanal com lista comentada.',
    },
    {
        id: 3,
        turma: 'Historia Geral',
        professor: 'Ricardo Nunes',
        turno: 'Noturno',
        alunos: 28,
        observacao: 'Turma com projetos interdisciplinares e debates guiados em sala.',
    },
];

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tablePage, setTablePage] = useState(0);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [tableRows, setTableRows] = useState([]);
    const { showError, showWarning, showInfo } = useToast();

    const pageSize = 2;

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const tableStart = tablePage * pageSize;
            setTableRows(demoRows.slice(tableStart, tableStart + pageSize));
            setIsTableLoading(false);
        }, 450);

        return () => {
            window.clearTimeout(timer);
        };
    }, [tablePage, pageSize]);

    const handleTablePageChange = (nextPage) => {
        if (nextPage === tablePage) {
            return;
        }

        setIsTableLoading(true);
        setTablePage(nextPage);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-semibold text-gray-700 mb-2">Noctua - Componentes UI</h1>
                <p className="text-gray-600">Exemplos minimos de Modal, Table e Pageable</p>
            </div>

            <Card
                header={
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">Modal</h2>
                        <p className="text-gray-600">Modal reutilizando o Card com fundo desfocado</p>
                    </div>
                }
            >
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Abrir modal
                </Button>

                <HomeCreateTurmaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </Card>

            <div className="space-y-4">
                <Table
                    data={tableRows}
                    loading={isTableLoading}
                    loadingRows={pageSize}
                    rowKey="id"
                    onView={(row) => showInfo('Visualizar', `Turma: ${row.turma}`)}
                    onEdit={(row) => showWarning('Editar', `Editar ${row.turma}`)}
                    onDelete={(row) => showError('Excluir', `Excluindo ${row.turma}`)}
                    actionTooltips={{ view: 'Exibir', edit: 'Editar', delete: 'Excluir' }}
                    pageable={{
                        page: tablePage,
                        pageSize,
                        totalItems: demoRows.length,
                        currentItemsCount: tableRows.length,
                        onPageChange: handleTablePageChange,
                    }}
                >
                    <Table.Column header="Turma" accessor="turma" />
                    <Table.Column header="Professor" accessor="professor" />
                    <Table.Column header="Turno" accessor="turno" />
                    <Table.Column header="Alunos" accessor="alunos" />
                    <Table.Column
                        header="Observacao"
                        render={(row) => (
                            <Tooltip content={row.observacao}>
                                <span className="inline-block max-w-[200px] truncate text-gray-600">
                                    {row.observacao}
                                </span>
                            </Tooltip>
                        )}
                    />
                </Table>
            </div>

            <Card header={<h2 className="text-xl font-semibold text-gray-700">Tooltip</h2>}>
                <Tooltip content="Esse texto aparece abaixo ao passar o mouse.">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <i className="pi pi-info-circle text-sm"></i>
                        Passar o mouse em cima
                    </span>
                </Tooltip>
            </Card>
        </div>
    );
};

export default HomePage;
