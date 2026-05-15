import React from "react";
import Card from "../Card";
import PendingEvaluationAlert from "./PendingEvaluationCard";

const PendingAlertsSection = ({ alerts }) => {
    return (
        <Card>
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <i className="pi pi-exclamation-circle text-amber-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Atenção</h2>
                </div>

                <p className="mt-1 text-sm text-gray-600">
                    Existem avaliações cadastradas há mais de 15 dias que ainda não possuem notas lançadas.
                </p>
            </div>

            {alerts.length > 0 ? (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <PendingEvaluationAlert
                            key={alert.id}
                            turma={alert.turma}
                            tipo={alert.tipo}
                            titulo={alert.titulo}
                            diasPendentes={alert.diasPendentes}
                            onAdjust={alert.onAdjust}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-5 text-sm text-emerald-700">
                    <i className="pi pi-check-circle mr-2" />
                    Nenhuma avaliação pendente de lançamento de notas.
                </div>
            )}
        </Card>
    );
};

export default PendingAlertsSection;