import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button } from '../../components/UI';
import corujinha from '../../assets/corujinha.png';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');

        if (!email || !senha) {
            setErro('Preencha todos os campos.');
            return;
        }

        try {
            setCarregando(true);
            console.log('Login:', { email, senha });
        } catch (err) {
            setErro('E-mail ou senha inválidos.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f6f7f9',
                padding: '24px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    textAlign: 'center',
                }}
            >

                <img
                    src={corujinha}
                    alt="Logo Noctua"
                    style={{
                        width: '58px',
                        height: '58px',
                        objectFit: 'contain',
                        margin: '0 auto 4px auto',
                        display: 'block',
                    }}
                />


                <h1
                    style={{
                        margin: 0,
                        fontSize: '36px',
                        fontWeight: 500,
                        lineHeight: '1.22',
                        letterSpacing: '-3px',
                        color: '#111827',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    Noctua
                </h1>


                <p
                    style={{
                        marginTop: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#6b7280',
                    }}
                >
                    <span style={{ fontStyle: 'italic' }}>Insights</span> poderosos que mudam a educação.
                </p>


                <Card
                    style={{
                        border: '1px solid #C6D2FF',
                        borderRadius: '16px',
                        boxShadow: 'none',
                    }}
                >
                    <div style={{ textAlign: 'left' }}>
                        <h2
                            style={{
                                marginTop: 2,
                                marginBottom: '14px',
                                fontSize: '16px',
                                fontWeight: 500,
                                color: '#1f2937',
                            }}
                        >
                            Acesso ao portal
                        </h2>

                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="E-mail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu e-mail"
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="Senha"
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite sua senha"
                                />
                            </div>

                            {erro && (
                                <p
                                    style={{
                                        marginTop: 0,
                                        marginBottom: '16px',
                                        color: '#DC6B6B',
                                        fontSize: '13px',
                                    }}
                                >
                                    {erro}
                                </p>
                            )}

                            <div style={{ width: '100%' }}>
                                <Button
                                    type="submit"
                                    disabled={carregando}
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        marginTop: '3px',
                                        marginBottom: '15px',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {carregando ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>


                <div
                    style={{
                        marginTop: '32px',
                        fontSize: '14px',
                        color: '#6b7280',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <div>
                        Não possui conta?{' '}
                        <Link to="/cadastro" style={{ textDecoration: 'underline' }}>
                            Cadastrar
                        </Link>
                    </div>

                    <div>
                        Esqueceu sua senha?{' '}
                        <Link to="/redefinir" style={{ textDecoration: 'underline' }}>
                            Redefinir
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}