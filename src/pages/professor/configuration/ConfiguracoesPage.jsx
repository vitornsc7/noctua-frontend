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
            <div className="flex h-full flex-col justify-between gap-2">
                <div className='flex gap-4 flex-row'>
                    <div
                        className={[
                            'flex min-h-14 min-w-14 items-center justify-center rounded-lg bg-gray-100 text-gray-600'
                        ].join(' ')}
                    >
                        <span className={[icon, 'text-lg'].join(' ')}></span>
                    </div>
                    <div>
                        <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-gray-700">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
            </div>
            <button className="pt-2 text-sm text-primary underline underline-offset-4 focus:outline-none focus:font-bold focus:text-secondary">
                {actionLabel}
            </button>
        </Card>
    );

    if (onClick) {
        return (
            <div
                type="button"
                onClick={onClick}
                className="block h-full w-full text-left "
            >
                {content}
            </div>
        );
    }

    if (!to) {
        return content;
    }

    return (
        <Link to={to} className="block h-full" tabIndex={-1}>
            {content}
        </Link>
    );
};

const ConfiguracoesPage = () => {
    const [dadosModalAberto, setDadosModalAberto] = useState(false);

    return (
        <>
            <div className='space-y-2'>
                <div className='mb-8'>
                    <h1 className="mb-2 text-3xl font-semibold text-gray-700">
                        Configurações
                    </h1>
                    <p className="text-gray-600">
                        Gerencie suas preferências e dados da conta.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
                    <SettingCard
                        icon="pi pi-user"
                        title="Dados cadastrais"
                        description="Altere seus dados a qualquer momento."
                        actionLabel="Alterar dados"
                        onClick={() => setDadosModalAberto(true)}
                    />
                    <SettingCard
                        icon="pi pi-chart-bar"
                        title="Limites de frequência e nota"
                        description="Defina o intervalo dos valores de classificação."
                        actionLabel="Configurar limites"
                        to="/configuracoes/limites"
                    />
                    <SettingCard
                        icon="pi pi-shield"
                        title="Segurança"
                        description="Adicione uma camada extra de segurança à sua conta com 2FA."
                        actionLabel="Configurar 2FA"
                        to="/configuracoes/2fa"
                    />
                </div>
                <Card>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">
                                Precisa de ajuda com as configurações?
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Nossa equipe de suporte está disponível para tirar qualquer dúvida sobre a plataforma.
                            </p>
                        </div>
                        <Button variant="outline" as="a" href="mailto:contato.noctua.br@gmail.com">
                            Falar com suporte
                        </Button>
                    </div>
                </Card>
            </div>

            {dadosModalAberto && (
                <DadosCadastraisModal
                    open={dadosModalAberto}
                    onClose={() => setDadosModalAberto(false)}
                />
            )}
        </>
    );
};

export default ConfiguracoesPage;