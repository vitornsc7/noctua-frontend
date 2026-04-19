import React, { useEffect, useMemo, useState } from 'react';
import { Card, Input, Table, useToast } from '../../components/UI';
import { buscarMonitoramentoAdmin } from '../../api/adminApi';

const formatarStatus = (ativo) => (ativo ? 'Ativo' : 'Inativo');

const formatarExpiracao = (valor) => {
    if (!valor) return 'Sem expiração';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return 'Sem expiração';

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(data).replace(',', ' -');
};

const StatCard = ({ title, value }) => (
    <Card variant="accent" className="min-w-[220px]">
        <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
        </div>
    </Card>
);

const MonitoramentoOperacionalPage = () => {
    const { showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [monitoramento, setMonitoramento] = useState({
        totalProfessores: 0,
        professoresAtivos: 0,
        professores: [],
    });

    useEffect(() => {
        let active = true;

        buscarMonitoramentoAdmin()
            .then((data) => {
                if (!active) return;
                setMonitoramento(data);
            })
            .catch((err) => {
                if (!active) return;
                showError('Erro ao carregar monitoramento', err.message);
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [showError]);

    const professoresFiltrados = useMemo(() => {
        const termo = search.trim().toLowerCase();

        if (!termo) {
            return monitoramento.professores;
        }

        return monitoramento.professores.filter((professor) => {
            return [professor.nome, professor.email]
                .filter(Boolean)
                .some((valor) => valor.toLowerCase().includes(termo));
        });
    }, [monitoramento.professores, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-gray-800">Monitoramento operacional</h1>
                    <p className="mt-2 text-base text-gray-500">Painel administrativo da Noctua</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <StatCard title="Total de professores" value={monitoramento.totalProfessores} />
                    <StatCard title="Professores ativos" value={monitoramento.professoresAtivos} />
                </div>
            </div>

            <Input
                placeholder="Pesquisar professor"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                leftIcon={<i className="pi pi-search text-sm" aria-hidden="true"></i>}
                fullWidth
            />

            <Table
                data={professoresFiltrados}
                rowKey="id"
                loading={loading}
                emptyMessage="Nenhum professor encontrado."
                actionsHeader="Ações"
                actions={() => (
                    <button
                        type="button"
                        className="inline-flex items-center justify-center text-gray-600 transition hover:text-gray-800"
                        aria-label="Editar professor"
                        title="Edição de professor será adicionada depois"
                    >
                        <i className="pi pi-pencil text-sm" aria-hidden="true"></i>
                    </button>
                )}
            >
                <Table.Column header="Professor" accessor="nome" />
                <Table.Column header="E-mail" accessor="email" />
                <Table.Column header="Status" render={(row) => formatarStatus(row.ativo)} />
                <Table.Column header="Expiração" render={(row) => formatarExpiracao(row.dataExpiracao)} />
            </Table>
        </div>
    );
};

export default MonitoramentoOperacionalPage;