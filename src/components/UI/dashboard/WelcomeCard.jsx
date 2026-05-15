import React from 'react';
import Card from '../Card';
import wavingNoctua from '../../../assets/waving-noctua.gif';

const WelcomeCard = () => {
    return (
        <Card className="relative h-full overflow-hidden">
            <div className="relative flex h-full min-h-[150px] items-center">
                <div className="absolute -left-10 top-1/2 flex h-28 w-36 -translate-y-1/2 items-center justify-start">
                    <img
                        src={wavingNoctua}
                        alt="Noctua acenando"
                        className="h-28 w-28 scale-x-[-1] object-contain"
                    />
                </div>

                <div className="ml-24 max-w-[300px] pr-3">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                            Olá!
                        </h2>

                        <p className="text-sm font-medium text-gray-500">
                            Bem-vindo à Noctua.
                        </p>
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                        Seu portal para visualização de análises educacionais.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default WelcomeCard;