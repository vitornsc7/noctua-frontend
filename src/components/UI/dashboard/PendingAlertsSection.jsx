import React from 'react';
import Card from '../Card';
import PendingEvaluationAlert from './PendingEvaluationCard';

const PendingAlertsSection = ({ alerts, loading }) => {
    const hasAlerts = alerts.length > 0;
    console.log(alerts)

    return (
        <Card>
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600">
                            {loading ? 'Pendências de notas' : hasAlerts ? <><i className="pi pi-info-circle mr-1" /> Pendências de notas</> : 'Tudo em dia'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {loading
                                ? 'Verificando...'
                                : hasAlerts
                                    ? `${alerts.length} avaliação${alerts.length > 1 ? 'ões' : ''} com mais de 14 dias sem nota lançada.`
                                    : 'Nenhuma avaliação pendente de lançamento.'}
                        </p>
                    </div>

                    {!loading && hasAlerts && (
                        <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-700">
                            {alerts.length}
                        </span>
                    )}
                </div>

                {loading ? (
                    <i className="pi pi-spin pi-spinner text-primary text-2xl"></i>
                ) : hasAlerts ? (
                    <div className="divide-y divide-gray-100 border-t border-gray-200">
                        {alerts.map((alert) => (
                            <PendingEvaluationAlert
                                key={alert.id}
                                turma={alert.turma}
                                tipo={alert.tipo}
                                tema={alert.tema}
                                diasPendentes={alert.diasPendentes}
                                alunosSemNota={alert.alunosSemNota}
                                avaliacaoId={alert.avaliacaoId}
                                turmaId={alert.turmaId}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">
                        <i className="pi pi-check mr-2" />
                        Você está em dia. Todas as notas foram lançadas.
                    </p>
                )}
            </div>
        </Card>
    );
};

export default PendingAlertsSection;