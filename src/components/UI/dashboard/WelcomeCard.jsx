import React from 'react';
import Card from '../Card';
import wavingNoctua from '../../../assets/noctua.svg';
import { useAuth } from '../../../context/AuthContext';

const WelcomeCard = () => {
    const { user } = useAuth();
    const firstName = user?.nome?.split(' ')[0] ?? 'Professor';

    const hoje = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date());
    const hojeFormatado = hoje.charAt(0).toUpperCase() + hoje.slice(1);

    return (
        <Card className="relative h-full overflow-hidden">
            <div className="relative flex h-full min-h-[150px] items-center">
                <img
                    src={wavingNoctua}
                    alt="Noctua acenando"
                    className="h-28 w-28 shrink-0"
                />

                <div className="ml-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                        {hojeFormatado}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold leading-tight text-primary">
                        Olá, {firstName}!
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Veja o resumo das suas turmas e pendências abaixo.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default WelcomeCard;