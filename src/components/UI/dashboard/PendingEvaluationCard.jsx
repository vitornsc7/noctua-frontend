import React from 'react';

const PendingEvaluationAlert = ({
    turma,
    tipo,
    tema,
    diasPendentes,
    onAdjust,
}) => {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <i className="pi pi-exclamation-triangle text-sm" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-800">{turma}</p>

                    <p className="mt-1 text-sm text-gray-700">
                        {tipo}: <span className="font-medium">{tema}</span>
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
