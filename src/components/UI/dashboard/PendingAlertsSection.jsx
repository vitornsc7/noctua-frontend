import React from 'react';
import Card from '../Card';
import PendingEvaluationAlert from './PendingEvaluationCard';

const PendingAlertsSection = ({ alerts }) => {
    const hasAlerts = alerts.length > 0;

    return (
        <Card>
            <div className="p-2">
                <div className="mb-5">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {hasAlerts ? 'Atenção' : 'Tudo em dia!'}
                        </h2>
                    </div>

                    {hasAlerts && (
                        <p className="mt-1 text-sm text-gray-600">
                            Existem avaliações cadastradas há mais de 15 dias que ainda não possuem notas lançadas.
                        </p>
                    )}
                </div>

                {hasAlerts ? (
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <PendingEvaluationAlert
                                key={alert.id}
                                turma={alert.turma}
                                tipo={alert.tipo}
                                tema={alert.tema}
                                diasPendentes={alert.diasPendentes}
                                onAdjust={alert.onAdjust}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-5 text-sm text-emerald-700">
                        <i className="pi pi-check-circle mr-2" />
                        Você está em dia. Não há avaliações pendentes de lançamento de notas.
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PendingAlertsSection;
