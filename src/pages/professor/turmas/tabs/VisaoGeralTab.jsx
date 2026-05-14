import React, { useEffect, useState } from 'react';
import { listarAlunos, listarFaltasPorTurma } from '../../../../api/turmaApi';
import { useToast } from '../../../../components/UI';
import BoletimProgressivoTable from '../../../../components/UI/BoletimProgressivoTable';

const VisaoGeralTab = ({ turma }) => {
    const [alunos, setAlunos] = useState([]);
    const [faltas, setFaltas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    useEffect(() => {
        if (!turma?.id) return;

        setLoading(true);

        Promise.all([
            listarAlunos(turma.id, { ativo: true, page: 0, size: 100 }),
            listarFaltasPorTurma(turma.id),
        ])
            .then(([alunosData, faltasData]) => {
                setAlunos(alunosData.content ?? []);
                setFaltas(faltasData ?? []);
            })
            .catch((err) => showError('Erro ao carregar visão geral', err.message))
            .finally(() => setLoading(false));
    }, [turma?.id, showError]);

    return (
        <div className="space-y-6 py-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    Boletim progressivo anual
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Acompanhe a média, frequência e sugestão de intervenção dos alunos ao longo do ano letivo.
                </p>
            </div>

            <BoletimProgressivoTable
                alunos={alunos}
                faltas={faltas}
                turma={turma}
                loading={loading}
            />
        </div>
    );
};

export default VisaoGeralTab;