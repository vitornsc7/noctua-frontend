import React from "react";
import Card from "../Card";

const WelcomeCard = ({ professorName, totalTurmas, pendingEvaluations }) => {
    return (
        <Card>
            <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <i className="pi pi-moon text-3xl text-primary" />
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Bem-vindo ao portal da Noctua</p>

                    <h2 className="mt-1 text-xl font-semibold text-gray-800">
                        Olá{professorName ? `, ${professorName}` : ''}!
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        Você possui{' '}
                        <span className="font-semibold text-gray-800">{totalTurmas}</span>{' '}
                        turmas ativas e{' '}
                        <span className="font-semibold text-gray-800">{pendingEvaluations}</span>{' '}
                        avaliações pendentes de lançamento de notas.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default WelcomeCard;