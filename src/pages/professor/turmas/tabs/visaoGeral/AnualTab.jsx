import React, { useState } from 'react';
import BoletimProgressivoTable from '../../../../../components/UI/BoletimProgressivoTable';
import { exportarBoletimAnual } from '../../../../../api/turmaApi';
import { useToast } from '../../../../../components/UI';

const AnualTab = ({ alunos, faltas, turma, mediasAlunos, limites }) => {
    const [exporting, setExporting] = useState(false);
    const { showError } = useToast();

    const handleExport = () => {
        if (!turma?.id) return;
        setExporting(true);
        exportarBoletimAnual(turma.id)
            .catch((err) => showError('Erro ao exportar boletim', err.message))
            .finally(() => setExporting(false));
    };

    return (
        <div className="space-y-8">
            <section className="space-y-5">
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Boletim anual</h3>
                        <p
                            onClick={!exporting ? handleExport : undefined}
                            className={`text-sm text-gray-600 underline underline-offset-4 transition ${exporting ? 'opacity-50 cursor-default' : 'hover:text-gray-700 cursor-pointer'}`}
                        >
                            Exportar
                        </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Acompanhe a evolução de média e frequência dos alunos ao longo do ano letivo.
                    </p>
                </div>
                <BoletimProgressivoTable
                    alunos={alunos}
                    faltas={faltas}
                    turma={turma}
                    mediasAlunos={mediasAlunos}
                    limites={limites}
                    mediaMinima={turma?.mediaMinima}
                />
            </section>
        </div>
    );
};

export default AnualTab;

