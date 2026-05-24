import React from 'react';
import Card from '../Card';
import PendingEvaluationAlert from './PendingEvaluationCard';

const PendingAlertsSection = ({ alerts, loading }) => {
    const hasAlerts = alerts.length > 0;

    return (
        <Card>
            <div className="p-2">
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${loading ? 'bg-gray-100 text-gray-400'
                                : hasAlerts ? 'bg-amber-100 text-amber-600'
                                    : 'bg-emerald-100 text-emerald-600'
                            }`}>
                            <i className={`text-sm ${loading ? 'pi pi-spin pi-spinner'
                                    : hasAlerts ? 'pi pi-exclamation-triangle'
                                        : 'pi pi-check'
                                }`} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-800">
                                {loading ? 'Verificando pendências...' : hasAlerts ? 'Pendências de notas' : 'Tudo em dia!'}
                            </h2>
                            {!loading && hasAlerts && (
                                <p className="mt-0.5 text-sm text-gray-500">
                                    {alerts.length} avaliação{alerts.length > 1 ? 'ões' : ''} com mais de 14 dias sem nota lançada.
                                </p>
                            )}
                            {!loading && !hasAlerts && (
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Nenhuma avaliação pendente de lançamento.
                                </p>
                            )}
                        </div>
                    </div>

                    {!loading && hasAlerts && (
                        <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            {alerts.length}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-400">
                        Carregando avisos...
                    </div>
                ) : hasAlerts ? (
                    <div className="space-y-2">
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
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                        Você está em dia. Todas as notas foram lançadas.
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PendingAlertsSection;
