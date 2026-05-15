import React from 'react';
import WelcomeCard from '../../components/UI/dashboard/WelcomeCard';
import MetricCard from '../../components/UI/dashboard/MetricCard';
import PendingAlertsSection from '../../components/UI/dashboard/PendingAlertsSection';

const DashboardPage = () => {
    const dashboardData = {
        totalAlunos: 225,
        totalTurmas: 9,
        totalAvaliacoes: 54,
    };

    const pendingAlerts = [
        {
            id: 1,
            turma: '2º ano A',
            tipo: 'Prova',
            titulo: 'Reações orgânicas',
            diasPendentes: 18,
            onAdjust: () => console.log('Ajustar avaliação 1'),
        },
        {
            id: 2,
            turma: '7º ano A',
            tipo: 'Atividade',
            titulo: 'Questionário sobre II Guerra Mundial',
            diasPendentes: 15,
            onAdjust: () => console.log('Ajustar avaliação 2'),
        },
    ];

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

            <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[4fr_2fr_2fr_2fr]">
                <WelcomeCard />

                <MetricCard
                    title="Alunos"
                    value={dashboardData.totalAlunos}
                    description="Alunos ativos"
                />

                <MetricCard
                    title="Turmas"
                    value={dashboardData.totalTurmas}
                    description="Turmas ativas"
                />

                <MetricCard
                    title="Avaliações"
                    value={dashboardData.totalAvaliacoes}
                    description="Avaliações cadastradas"
                />
            </div>
            <PendingAlertsSection alerts={pendingAlerts} />
        </div>
    );
};

export default DashboardPage;