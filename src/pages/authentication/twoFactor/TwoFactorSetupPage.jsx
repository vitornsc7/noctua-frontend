import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TwoFactorSetupPage() {
    const [code, setCode] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Noctua:usuario@email.com?secret=ABC123');
        setSecret('ABC123XYZ');
    }, []);

    const handleVerify = () => {
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (code === '123456') {
                setSuccess(true);
            } else {
                setError('Código inválido.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="mx-auto max-w-7xl">
            <Link to="/professor/configuracoes" className="text-sm text-slate-500">
                ← Configurações
            </Link>

            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
                Autenticação de Dois Fatores (2FA)
            </h1>

            <p className="mt-2 text-slate-600">
                Proteja sua conta com uma camada extra de segurança.
            </p>

            <div className="mt-5 grid gap-6 xl:grid-cols-[1.7fr_1fr] items-start">
                <div className="rounded-[20px] border p-8 bg-white shadow-sm space-y-10">

                    <Step number="1" title="Instale o aplicativo">
                        <p className="text-slate-600">
                            Instale o Google Authenticator no seu celular.
                        </p>
                    </Step>

                    <Step number="2" title="Escaneie o QR Code">
                        <p className="text-slate-600">
                            Use o aplicativo para escanear o código abaixo.
                        </p>

                        <img src={qrCode} className="mt-4 w-32 h-32" />

                        <p className="mt-2 text-sm text-slate-500">
                            Código manual: {secret}
                        </p>
                    </Step>

                    <Step number="3" title="Verifique o código">
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            placeholder="000000"
                            className="mt-4 w-40 h-12 text-center border rounded-xl tracking-[0.4em]"
                        />

                        <button
                            onClick={handleVerify}
                            className="ml-4 h-12 px-6 bg-slate-700 text-white rounded-xl"
                        >
                            {loading ? 'Verificando...' : 'Verificar e ativar'}
                        </button>

                        {error && (
                            <p className="mt-2 text-red-500 text-sm">{error}</p>
                        )}

                        {success && (
                            <p className="mt-2 text-green-600 text-sm">
                                2FA ativado com sucesso!
                            </p>
                        )}
                    </Step>

                </div>

                <div className="rounded-[20px] border p-6 bg-white shadow-sm">
                    <h2 className="text-sm font-semibold uppercase text-slate-700">
                        Segurança
                    </h2>

                    <p className="mt-4 text-slate-600">
                        A autenticação em dois fatores protege sua conta contra acessos não autorizados.
                    </p>
                </div>

            </div>
        </div>
    );
}

function Step({ number, title, children }) {
    return (
        <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                {number}
            </div>

            <div>
                <h3 className="font-medium text-slate-800">{title}</h3>
                {children}
            </div>
        </div>
    );
}