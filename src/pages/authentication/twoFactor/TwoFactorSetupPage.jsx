import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Button, Card, Input, useToast } from '../../../components/UI';
import { getToken, setup2FA, verifySetup2FA } from '../../../api/authApi';

export default function TwoFactorSetupPage() {
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();
    const [code, setCode] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [otpauthUrl, setOtpauthUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const setupInitializedRef = useRef(false);

    useEffect(() => {
        if (!otpauthUrl) {
            return;
        }

        QRCode.toDataURL(otpauthUrl)
            .then(setQrCode)
            .catch(() => setError('Erro ao gerar QR Code.'));
    }, [otpauthUrl]);

    useEffect(() => {
        if (setupInitializedRef.current) {
            return;
        }

        setupInitializedRef.current = true;

        const initSetup = async () => {
            if (!getToken()) {
                navigate('/login', { replace: true });
                return;
            }

            try {
                setLoading(true);
                setError('');

                const data = await setup2FA();
                setSecret(data?.secret ?? '');
                setOtpauthUrl(data?.otpauthUrl ?? '');
            } catch (err) {
                if (String(err.message).includes('403')) {
                    navigate('/login', { replace: true });
                    return;
                }

                const message = err.message || 'Não foi possível iniciar a configuração do 2FA.';
                setError(message);
                showError('Erro ao iniciar 2FA', message);
            } finally {
                setLoading(false);
            }
        };

        initSetup();
    }, [navigate]);

    const handleVerify = async () => {
        try {
            setLoading(true);
            setError('');

            await verifySetup2FA(code);

            setSuccess(true);
            showSuccess('2FA ativado com sucesso', 'A autenticação em dois fatores está ativa na sua conta.');
        } catch (err) {
            if (String(err.message).includes('403')) {
                navigate('/login', { replace: true });
                return;
            }

            const message = err.message || 'Código inválido ou expirado.';
            setError(message);
            setCode('');
            showError('Não foi possível ativar o 2FA', message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopySecret = async () => {
        if (!secret) {
            return;
        }

        try {
            await navigator.clipboard.writeText(secret);
            showSuccess('Código copiado', 'O código manual foi copiado para a área de transferência.');
        } catch {
            showError('Não foi possível copiar', 'Copie o código manualmente.');
        }
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
    };

    return (
        <div className="space-y-6">
            <div>
                <Link to="/configuracoes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                    <span>Configurações</span>
                </Link>

                <h1 className="mt-2 text-3xl font-semibold text-gray-700">
                    Autenticação em dois fatores
                </h1>

                <p className="mt-2 max-w-2xl text-gray-600">
                    Ative uma camada extra de proteção para exigir um código temporário do autenticador durante o login.
                </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
                <Card
                    variant="accent"
                    header={
                        <div>
                            <h2 className="text-lg font-medium text-gray-700">Configurar aplicativo autenticador</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Use Google Authenticator para configurar a autenticação em dois fatores.
                            </p>
                        </div>
                    }
                    footer={
                        <div>
                            <p className="m-0 text-sm text-gray-500">
                                {success
                                    ? 'Sua conta já está protegida com autenticação em dois fatores.'
                                    : 'Depois da ativação, o código será solicitado no próximo login.'}
                            </p>

                            <div className="flex justify-end gap-2 mt-2">
                                <Button onClick={handleVerify} disabled={loading || code.length !== 6 || success}>
                                    {loading ? 'Verificando...' : success ? 'Ativado' : 'Verificar e ativar'}
                                </Button>
                            </div>
                        </div>
                    }
                >
                    <div className="space-y-6">
                        <StepCard
                            number="1"
                            title="Abra seu autenticador"
                            description="Instale ou abra o aplicativo no celular e escolha a opção para adicionar uma nova conta."
                        />

                        <StepCard
                            number="2"
                            title="Escaneie o QR Code"
                            description="Se preferir, você também pode cadastrar a conta usando o código manual exibido abaixo."
                        >
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-top">
                                <div>
                                    {loading && !qrCode ? (
                                        <span className="text-sm text-gray-500">Gerando QR Code...</span>
                                    ) : qrCode ? (
                                        <img src={qrCode} alt="QR Code para ativar 2FA" className="h-40 w-40" />
                                    ) : (
                                        <span className="px-3 text-center text-sm text-gray-500">
                                            QR Code indisponível no momento.
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-2 p-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-gray-700">Código manual</p>
                                        {secret && !success && (
                                            <Button
                                                variant="outline"
                                                onClick={handleCopySecret}
                                                className="px-2.5 py-1 text-xs"
                                                leftIcon={<i className="pi pi-copy text-xs" aria-hidden="true"></i>}
                                            >
                                                Copiar
                                            </Button>
                                        )}
                                    </div>
                                    <div className="break-all rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm tracking-[0.2em] text-gray-700">
                                        {secret || 'Aguardando geração...'}
                                    </div>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard
                            number="3"
                            title="Confirme o código de 6 dígitos"
                            description="Digite o código atual gerado pelo aplicativo para concluir a ativação."
                        >
                            <div className="mt-4 max-w-sm space-y-3">
                                <Input
                                    label="Código do autenticador"
                                    placeholder="000000"
                                    value={code}
                                    onChange={handleCodeChange}
                                    integerOnly
                                    maxChars={6}
                                    fullWidth
                                    error={error || undefined}
                                />

                                {success && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                        Autenticação em dois fatores ativada com sucesso.
                                    </div>
                                )}
                            </div>
                        </StepCard>
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card header={<h2 className="text-base font-medium text-gray-700">O que muda no acesso</h2>}>
                        <div className="space-y-3 text-sm text-gray-600">
                            <InfoRow
                                icon="pi pi-shield"
                                title="Mais proteção"
                                description="Mesmo com a senha correta, o acesso só é liberado com o código temporário do aplicativo."
                            />
                            <InfoRow
                                icon="pi pi-mobile"
                                title="Uso no celular"
                                description="Guarde o dispositivo autenticador em segurança, porque ele passa a fazer parte do login."
                            />
                            <InfoRow
                                icon="pi pi-clock"
                                title="Código temporário"
                                description="O código muda a cada poucos segundos, então use sempre o valor mais recente mostrado no app."
                            />
                        </div>
                    </Card>

                    <Card header={<h2 className="text-base font-medium text-gray-700">Antes de finalizar</h2>}>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Confirme que o relógio do celular está sincronizado automaticamente.</p>
                            <p>Se o QR Code não abrir, use o código manual para cadastrar a conta.</p>
                            <p>Depois de ativar, faça logout e valide o fluxo completo em um novo login.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StepCard({ number, title, description, children }) {
    return (
        <Card>
            <div className="flex gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-sm font-semibold text-[#4057C7]">
                    {number}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-gray-700">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                    {children}
                </div>
            </div>
        </Card>
    );
}

function InfoRow({ icon, title, description }) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <i className={icon}></i>
            </div>

            <div>
                <p className="text-sm font-medium text-gray-700">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}