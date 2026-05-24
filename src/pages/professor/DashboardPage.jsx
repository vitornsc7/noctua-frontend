import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import WelcomeCard from '../../components/UI/dashboard/WelcomeCard';
import MetricCard from '../../components/UI/dashboard/MetricCard';
import PendingAlertsSection from '../../components/UI/dashboard/PendingAlertsSection';
import { getAvisosPendentes, getDashboardMetricas } from '../../api/professorApi';
import { TIPO_AVALIACAO_DISPLAY } from '../../utils/displayMaps';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [pendingAlerts, setPendingAlerts] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(true);
    const [metricas, setMetricas] = useState(null);
    const [loadingMetricas, setLoadingMetricas] = useState(true);

    useEffect(() => {
        getDashboardMetricas()
            .then(setMetricas)
            .catch(() => setMetricas(null))
            .finally(() => setLoadingMetricas(false));
    }, []);

    useEffect(() => {
        getAvisosPendentes()
            .then((res) => {
                const alerts = res.map((aviso) => ({
                    id: aviso.avaliacaoId,
                    turma: aviso.turmaNome,
                    tipo: TIPO_AVALIACAO_DISPLAY[aviso.tipo] ?? aviso.tipo,
                    tema: aviso.tema,
                    diasPendentes: aviso.diasPendentes,
                    alunosSemNota: aviso.alunosSemNota,
                    onAdjust: () =>
                        navigate(
                            `/turmas/${aviso.turmaId}/avaliacoes/${aviso.avaliacaoId}/lancar-notas`
                        ),
                }));
                setPendingAlerts(alerts);
            })
            .catch(() => setPendingAlerts([]))
            .finally(() => setLoadingAlerts(false));
    }, [navigate]);

    const semTurmas = !loadingMetricas && metricas !== null && metricas.totalTurmas === 0;

    if (loadingMetricas) {
        return (
            <div className="relative min-h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <i className="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
                </div>
            </div>
        );
    }

    if (semTurmas) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="mb-2 text-3xl font-semibold text-gray-700">Dashboard</h1>
                    <p className="text-gray-600">Visão geral das turmas, alunos e pendências acadêmicas.</p>
                </div>

                <WelcomeCard />

                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                    <div className="flex flex-row gap-3 items-center">
                        <i className="pi pi-users text-2xl text-gray-500"></i>
                        <p className="text-gray-500 font-medium">Nenhuma turma ativa</p>
                    </div>
                    <p className="text-sm text-gray-400">
                        Crie uma turma para começar a usar o dashboard.
                    </p>
                    <Link
                        to="/turmas/"
                        className="mt-2 text-sm text-primary underline underline-offset-4 hover:opacity-80 transition"
                    >
                        Ir para turmas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                    Dashboard
                </h1>

                <p className="text-gray-600">
                    Visão geral das turmas, alunos e pendências acadêmicas.
                </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-2 xl:grid-cols-5 md:grid-cols-3">
                <div className="md:col-span-3 xl:col-span-2">
                    <WelcomeCard />
                </div>

                <MetricCard
                    title="Alunos"
                    value={metricas?.totalAlunos ?? '—'}
                    description="Alunos ativos"
                    icon="pi pi-users"
                    accentClass="bg-blue-100 text-blue-600"
                />

                <MetricCard
                    title="Turmas"
                    value={metricas?.totalTurmas ?? '—'}
                    description="Turmas ativas"
                    icon="pi pi-book"
                    accentClass="bg-violet-100 text-violet-600"
                />

                <MetricCard
                    title="Avaliações"
                    value={metricas?.totalAvaliacoes ?? '—'}
                    description="Avaliações cadastradas"
                    icon="pi pi-file-edit"
                    accentClass="bg-emerald-100 text-emerald-600"
                />
            </div>
            <PendingAlertsSection alerts={pendingAlerts} loading={loadingAlerts} />
        </div>
    );
};

export default DashboardPage;
