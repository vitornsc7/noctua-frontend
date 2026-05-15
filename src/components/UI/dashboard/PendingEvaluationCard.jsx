import React from 'react';

const PendingEvaluationAlert = ({
    turma,
    tipo,
    titulo,
    diasPendentes,
    onAdjust,
}) => {
    const getAlertStyle = () => {
        if (diasPendentes > 30) {
            return {
                container: 'border-red-200 bg-red-50/80',
                icon: 'bg-red-100 text-red-600',
                badge: 'bg-red-100 text-red-700',
                label: 'Crítico',
            };
        }

        if (diasPendentes > 20) {
            return {
                container: 'border-orange-200 bg-orange-50/80',
                icon: 'bg-orange-100 text-orange-600',
                badge: 'bg-orange-100 text-orange-700',
                label: 'Urgente',
            };
        }

        return {
            container: 'border-amber-200 bg-amber-50/80',
            icon: 'bg-amber-100 text-amber-600',
            badge: 'bg-amber-100 text-amber-700',
            label: 'Atenção',
        };
    };

    const alertStyle = getAlertStyle();

    return (
        <div
            className={`flex flex-col gap-4 rounded-2xl border px-4 py-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between ${alertStyle.container}`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${alertStyle.icon}`}
                >
                    <i className="pi pi-exclamation-triangle text-sm" />
                </div>

                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">{turma}</p>

                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${alertStyle.badge}`}>
                            {alertStyle.label}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-700">
                        {tipo}: <span className="font-medium">{titulo}</span>
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Cadastrada há {diasPendentes} dias e ainda sem notas lançadas.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onAdjust}
                className="self-start rounded-xl px-3 py-2 text-sm font-medium text-primary transition hover:bg-white/70 hover:underline sm:self-center"
            >
                Ajustar
            </button>
        </div>
    );
};

export default PendingEvaluationAlert;