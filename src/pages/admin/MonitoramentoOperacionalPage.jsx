import React, { useEffect, useMemo, useState } from 'react';
import { Card, Input, Select, Table, Tabs, useToast } from '../../components/UI';
import { buscarLogsAdmin, buscarMonitoramentoAdmin } from '../../api/adminApi';

const formatarData = (valor) => {
    if (!valor) return '—';
    const data = new Date(valor.endsWith('Z') ? valor : valor + 'Z');
    if (Number.isNaN(data.getTime())) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(data).replace(',', ' -');
};

const StatCard = ({ title, value }) => (
    <Card className="min-w-[220px]">
        <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
        </div>
    </Card>
);

const MonitoramentoOperacionalPage = () => {
    const { showError } = useToast();

    const [loadingMonitoramento, setLoadingMonitoramento] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [monitoramento, setMonitoramento] = useState({
        totalProfessores: 0,
        professoresAtivos: 0,
        professores: [],
    });
    const [logs, setLogs] = useState([]);
    const [searchProfessor, setSearchProfessor] = useState('');
    const [filtroProfessorLogs, setFiltroProfessorLogs] = useState('todos');

    useEffect(() => {
        let active = true;
        buscarMonitoramentoAdmin()
            .then((data) => { if (active) setMonitoramento(data); })
            .catch((err) => { if (active) showError('Erro ao carregar monitoramento', err.message); })
            .finally(() => { if (active) setLoadingMonitoramento(false); });
        return () => { active = false; };
    }, [showError]);

    useEffect(() => {
        let active = true;
        const professorId = filtroProfessorLogs !== 'todos' ? filtroProfessorLogs : undefined;
        setLoadingLogs(true);
        buscarLogsAdmin(professorId)
            .then((data) => { if (active) setLogs(data); })
            .catch((err) => { if (active) showError('Erro ao carregar logs', err.message); })
            .finally(() => { if (active) setLoadingLogs(false); });
        return () => { active = false; };
    }, [filtroProfessorLogs, showError]);

    const professoresFiltrados = useMemo(() => {
        const termo = searchProfessor.trim().toLowerCase();
        if (!termo) return monitoramento.professores;
        return monitoramento.professores.filter((p) =>
            [p.nome, p.email].filter(Boolean).some((v) => v.toLowerCase().includes(termo))
        );
    }, [monitoramento.professores, searchProfessor]);

    const professoresOptions = useMemo(() => [
        { value: 'todos', label: 'Todos os professores' },
        ...monitoramento.professores.map((p) => ({ value: String(p.id), label: p.nome })),
    ], [monitoramento.professores]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-800">Monitoramento operacional</h1>
                    <p className="mt-2 text-base text-gray-500">Painel administrativo da Noctua</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <StatCard title="Total de professores" value={monitoramento.totalProfessores} />
                    <StatCard title="Professores ativos" value={monitoramento.professoresAtivos} />
                </div>
            </div>

            <Tabs>
                <Tabs.Tab id="professores" label="Professores">
                    <div className="space-y-4">
                        <Input
                            placeholder="Pesquisar professor"
                            value={searchProfessor}
                            onChange={(e) => setSearchProfessor(e.target.value)}
                            leftIcon={<i className="pi pi-search text-sm" aria-hidden="true" />}
                            fullWidth
                        />
                        <Table
                            data={professoresFiltrados}
                            rowKey="id"
                            loading={loadingMonitoramento}
                            emptyMessage="Nenhum professor encontrado."
                        >
                            <Table.Column header="Professor" accessor="nome" />
                            <Table.Column header="E-mail" accessor="email" />
                            <Table.Column header="Status" render={(row) => (row.ativo ? 'Ativo' : 'Inativo')} />
                            <Table.Column header="Tokens usados" render={(row) => (row.totalTokens ?? 0).toLocaleString('pt-BR')} />
                        </Table>
                    </div>
                </Tabs.Tab>

                <Tabs.Tab id="logs" label="Logs de IA">
                    <div className="space-y-4">
                        {/* <Select
                            value={filtroProfessorLogs}
                            onChange={(val) => setFiltroProfessorLogs(val)}
                            options={professoresOptions}
                        /> */}
                        <Table
                            data={logs}
                            rowKey="id"
                            loading={loadingLogs}
                            emptyMessage="Nenhum log encontrado."
                        >
                            <Table.Column header="Professor" accessor="professorNome" />
                            <Table.Column header="Data da requisição" render={(row) => formatarData(row.dataRequest)} />
                            <Table.Column header="Tokens usados" render={(row) => (row.tokensUsados ?? 0).toLocaleString('pt-BR')} />
                        </Table>
                    </div>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
};

export default MonitoramentoOperacionalPage;