import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../../components/UI';
import DadosCadastraisModal from './components/DadosCadastraisModal';

const SettingCard = ({
    icon,
    title,
    description,
    actionLabel,
    to,
    onClick,
    highlight = false,
}) => {
    const content = (
        <Card className="h-full">
            <div className="flex h-full flex-col">
                <div className='flex gap-4 flex-col'>
                    <div
                        className={[
                            'flex h-11 w-11 items-center justify-center rounded-lg',
                            highlight ? 'bg-[#EEF2FF] text-primary' : 'bg-gray-100 text-gray-600',
                        ].join(' ')}
                    >
                        <i className={icon} aria-hidden="true"></i>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-gray-700">
                            {title}
                        </h2>
                        <p className="text-sm leading-6 text-gray-600">{description}</p>
                    </div>
                </div>

                <div className="mt-auto pt-2 text-sm text-primary underline underline-offset-4">
                    {actionLabel}
                </div>
            </div>
        </Card>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="block h-full w-full text-left"
            >
                {content}
            </button>
        );
    }

    if (!to) {
        return content;
    }

    return (
        <Link to={to} className="block h-full">
            {content}
        </Link>
    );
};

const ConfiguracoesPage = () => {
    const [dadosModalAberto, setDadosModalAberto] = useState(false);

    return (
        <>
            <div className='space-y-6'>
                <div>
                    <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                        Configurações
                    </h1>
                    <p className="text-gray-600">
                        Gerencie suas preferências e dados da conta.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SettingCard
                        icon="pi pi-user"
                        title="Dados cadastrais"
                        description="Altere seus dados a qualquer momento."
                        actionLabel="Alterar dados"
                        onClick={() => setDadosModalAberto(true)}
                    />
                    <SettingCard
                        icon="pi pi-chart-bar"
                        title="Limites de frequência"
                        description="Defina o intervalo dos valores da classificação da frequência."
                        actionLabel="Configurar limites"
                    />
                    <SettingCard
                        icon="pi pi-shield"
                        title="Segurança"
                        description="Adicione uma camada extra de segurança à sua conta de professor com 2FA."
                        actionLabel="Configurar 2FA"
                        to="/configuracoes/2fa"
                        highlight
                    />
                    <SettingCard
                        icon="pi pi-star-fill"
                        title="Status da conta"
                        description="Período de teste expira em 5 dia(s)."
                        actionLabel="Assinar agora"
                    />
                </div>
                <Card>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="mb-2 text-lg font-medium text-gray-700">
                                Precisa de ajuda com as configurações?
                            </h2>
                            <p className="text-gray-600">
                                Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre a plataforma.
                            </p>
                        </div>
                        <Button variant="outline">Falar com suporte</Button>
                    </div>
                </Card>
            </div>

            <DadosCadastraisModal
                open={dadosModalAberto}
                onClose={() => setDadosModalAberto(false)}
            />
        </>
    );
};

export default ConfiguracoesPage;