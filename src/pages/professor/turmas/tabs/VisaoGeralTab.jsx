import React, { Fragment } from 'react';
import BoletimProgressivoTable from '../../../../components/UI/BoletimProgressivoTable';

const VisaoGeralTab = () => {
    return (
        <div className="space-y-6 py-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    Visão geral da turma
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Boletim progressivo anual
                </p>
            </div>

            <BoletimProgressivoTable />
        </div>
    );
};

export default VisaoGeralTab;