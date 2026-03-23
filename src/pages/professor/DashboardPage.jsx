import React from 'react';
import { Card } from '../../components/UI';

const DashboardPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-700 mb-2">Dashboard</h1>
                <p className="text-gray-600">Visão geral do sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-2">Total de Usuarios</p>
                        <p className="text-4xl font-bold text-primary">1.234</p>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-2">Turmas Ativas</p>
                        <p className="text-4xl font-bold text-primary">42</p>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-2">Taxa de Conclusao</p>
                        <p className="text-4xl font-bold text-primary">87%</p>
                    </div>
                </Card>
            </div>

            <Card header={<h2 className="text-xl font-semibold text-gray-700">Atividade Recente</h2>}>
                <div className="space-y-4">
                    <p className="text-gray-600">Nenhuma atividade recente</p>
                </div>
            </Card>
        </div>
    );
};

export default DashboardPage;
