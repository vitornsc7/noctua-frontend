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
            tema: 'Reações orgânicas',
            diasPendentes: 18,
            onAdjust: () => window.alert('Direcionar para a tela de cadastro de notas dessa avaliação.'),
        },
        {
            id: 2,
            turma: '7º ano A',
            tipo: 'Atividade',
            tema: 'Questionário sobre II Guerra Mundial',
            diasPendentes: 15,
            onAdjust: () => window.alert('Direcionar para a tela de cadastro de notas dessa avaliação.'),
        },
        {
            id: 3,
            turma: '5º ano B',
            tipo: 'Trabalho',
            tema: 'Sistema solar',
            diasPendentes: 21,
            onAdjust: () => window.alert('Direcionar para a tela de cadastro de notas dessa avaliação.'),
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

            <div className="grid grid-cols-1 items-stretch gap-2 xl:grid-cols-5 md:grid-cols-3">
                <div className="md:col-span-3 xl:col-span-2">
                    <WelcomeCard />
                </div>

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
