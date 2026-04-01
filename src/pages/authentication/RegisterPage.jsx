import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button } from '../../components/UI';
import corujinha from '../../assets/corujinha.png';

export default function RegisterPage() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        setErro('');

        if (!nome || !cpf || !email || !senha) {
            setErro('Preencha todos os campos.');
            return;
        }

        console.log('Cadastro:', { nome, cpf, email, senha });
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
                            Criar conta
                        </h2>

                        <form onSubmit={handleRegister}>
                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="Nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="CPF"
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="E-mail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <Input
                                    label="Senha"
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
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
                                    Cadastrar
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
                    }}
                >
                    Já possui conta?{' '}
                    <Link to="/login" style={{ textDecoration: 'underline' }}>
                        Logar
                    </Link>
                </div>
            </div>
        </div>
    );
}