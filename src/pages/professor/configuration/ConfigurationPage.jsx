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
        onClick: () => console.log('Abrir dados cadastrais'),
    },
    {
        id: 2,
        title: 'LIMITES DE FREQUÊNCIA',
        description:
            'Defina o intervalo dos valores da classificação da frequência.',
        actionLabel: 'Configurar limites',
        icon: BarChart3,
        onClick: () => console.log('Abrir limites de frequência'),
    },
    {
        id: 3,
        title: 'SEGURANÇA',
        description:
            'Adicione uma camada extra de segurança à sua conta de professor (2FA).',
        actionLabel: 'Configurar 2FA',
        icon: ShieldCheck,
        onClick: () => console.log('Abrir segurança'),
    },
    {
        id: 4,
        title: 'STATUS DA CONTA',
        description: 'Período de teste expira em 5 dia(s).',
        actionLabel: 'Assinar agora',
        icon: Star,
        onClick: () => console.log('Abrir assinatura'),
    },
];

export default function ConfigurationPage() {
    const supportText = useMemo(
        () =>
            'Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre a plataforma',
        []
    );

    return (
        <main className="w-full pb-10 font-lexend">
            <header className="mb-8">
                <h1 className="text-3xl font-semibold text-slate-800">
                    Configurações
                </h1>
                <p className="mt-2 text-base font-normal text-slate-600">
                    Gerencie suas preferências e dados da conta
                </p>
            </header>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {configurationCards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card key={item.id} className="rounded-[20px]">
                            <div className="flex h-full min-h-[220px] flex-col">
                                <div className="mb-6 flex justify-center pt-5">                                    <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-slate-100">
                                    <Icon size={22} className="text-slate-600" />
                                </div>
                                </div>

                                <div className="flex flex-1 flex-col text-left">
                                    <h2 className="mb-3 whitespace-nowrap text-[14px] font-semibold text-slate-800">
                                        {item.title}
                                    </h2>

                                    <p className="mb-6 min-h-[120px] text-[15px] leading-8 text-slate-700">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto">
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                item.onClick();
                                            }}
                                            className="cursor-pointer text-sm text-blue-600 underline underline-offset-2"
                                        >
                                            {item.actionLabel}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </section>

            <section className="mt-8">
                <Card className="rounded-[20px]">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Precisa de ajuda com as configurações?
                        </h3>
                        <p className="text-base text-slate-700">{supportText}</p>
                        <div>
                            <Button onClick={() => console.log('Abrir suporte')}>
                                Falar com suporte
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>
        </main>
    );
}