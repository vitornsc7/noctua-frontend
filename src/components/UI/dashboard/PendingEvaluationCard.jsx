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
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2">
                    <span className="text-sm text-gray-500">{tipo}:</span>
                    <p className="truncate text-sm text-gray-600">{tema}</p>
                </div>
                <p className="text-sm font-medium text-gray-800">{turma}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3">
                    <span className="text-xs text-gray-400">{diasPendentes} dias sem nota</span>
                    {alunosSemNota > 0 && (
                        <span className="text-xs text-gray-500">
                            {alunosSemNota} aluno{alunosSemNota > 1 ? 's' : ''} pendente{alunosSemNota > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            <Link
                to={`/turmas/${turmaId}/avaliacoes/${avaliacaoId}/lancar-notas`}
                className="shrink-0 text-sm text-primary underline-offset-2 underline"
            >
                Lançar notas
            </Link>
        </div>
    );
};

export default PendingEvaluationAlert;