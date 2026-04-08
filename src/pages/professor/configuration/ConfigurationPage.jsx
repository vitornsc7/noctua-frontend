import { useMemo } from 'react';
import { Card, Button } from '../../../components/UI';
import { UserRound, BarChart3, ShieldCheck, Star } from 'lucide-react';

const configurationCards = [
    {
        id: 1,
        title: 'DADOS CADASTRAIS',
        description: 'Altere seus dados a qualquer momento.',
        actionLabel: 'Alterar dados',
        icon: UserRound,
        onClick: () => {
            console.log('Abrir dados cadastrais');
        },
    },
    {
        id: 2,
        title: 'LIMITES DE FREQUÊNCIA',
        description:
            'Defina o intervalo dos valores da classificação da frequência.',
        actionLabel: 'Configurar limites',
        icon: BarChart3,
        onClick: () => {
            console.log('Abrir limites de frequência');
        },
    },
    {
        id: 3,
        title: 'SEGURANÇA',
        description:
            'Adicione uma camada extra de segurança à sua conta de professor (2FA).',
        actionLabel: 'Configurar 2FA',
        icon: ShieldCheck,
        onClick: () => {
            console.log('Abrir segurança');
        },
    },
    {
        id: 4,
        title: 'STATUS DA CONTA',
        description: 'Período de teste expira em 5 dia(s).',
        actionLabel: 'Assinar agora',
        icon: Star,
        onClick: () => {
            console.log('Abrir assinatura');
        },
    },
];

export default function ConfigurationPage() {
    const supportText = useMemo(
        () =>
            'Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre a plataforma',
        []
    );

    return (

        <div className="min-h-screen bg-[#f7f7f9]">
            <div className="mx-auto w-full max-w-7xl px-8 py-10">
                <header className="mb-8">
                    <h1 className="text-4xl font-semibold text-slate-800">
                        Configurações
                    </h1>
                    <p className="mt-3 text-lg text-slate-600">
                        Gerencie suas preferências e dados da conta
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {configurationCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card
                                key={item.id}
                                className="rounded-3xl border border-slate-200 bg-white p-0 shadow-none"
                            >
                                <div className="flex min-h-[320px] h-full flex-col items-center px-6 py-8 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                                            <Icon size={22} className="text-slate-600" />
                                        </div>
                                    </div>

                                    <h2 className="min-h-[40px] whitespace-nowrap text-[14px] font-semibold uppercase leading-[1.2] tracking-wide text-slate-800">
                                        {item.title}
                                    </h2>

                                    <p className="mt-4 min-h-[120px] w-full text-[15px] leading-8 text-justify text-slate-600">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto pt-4">
                                        <button
                                            type="button"
                                            onClick={item.onClick}
                                            className="text-base font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                                        >
                                            {item.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </section>

                <section className="mt-8">
                    <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-none">
                        <h3 className="text-3xl font-semibold text-slate-800">
                            Precisa de ajuda com as configurações?
                        </h3>

                        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">
                            {supportText}
                        </p>

                        <div className="mt-6">
                            <Button
                                onClick={() => console.log('Abrir suporte')}
                                className="rounded-xl bg-slate-700 px-6 py-3 text-base font-medium text-white hover:bg-slate-800"
                            >
                                Falar com suporte
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </div>

    );
}