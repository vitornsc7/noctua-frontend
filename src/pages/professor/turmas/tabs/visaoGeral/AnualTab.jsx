import React from 'react';
import BoletimProgressivoTable from '../../../../../components/UI/BoletimProgressivoTable';

const AnualTab = ({ alunos, faltas, turma, mediasAlunos, limites }) => {
    return (
        <div className="space-y-8">
            <section className="space-y-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Boletim anual</h3>
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

