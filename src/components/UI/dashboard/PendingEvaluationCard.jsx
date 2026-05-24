import React from 'react';
import { Link } from 'react-router-dom';

const PendingEvaluationAlert = ({
    turma,
    tipo,
    tema,
    diasPendentes,
    alunosSemNota,
    avaliacaoId,
    turmaId,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3">
            <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <i className="pi pi-file-edit text-xs" />
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2">
                        <p className="text-sm font-semibold text-gray-800">{turma}</p>
                        <span className="text-xs text-gray-400">·</span>
                        <p className="text-xs text-gray-500">{tipo}</p>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-700">{tema}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-xs text-gray-400">
                            <i className="pi pi-clock mr-1 text-[10px]" />
                            {diasPendentes} dias sem nota
                        </span>
                        {alunosSemNota > 0 && (
                            <span className="text-xs font-medium text-amber-700">
                                <i className="pi pi-user mr-1 text-[10px]" />
                                {alunosSemNota} aluno{alunosSemNota > 1 ? 's' : ''} pendente{alunosSemNota > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Link
                to={`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/lancar-notas`}
                className="shrink-0 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
            >
                Lançar notas
            </Link>
        </div>
    );
};

export default PendingEvaluationAlert;
