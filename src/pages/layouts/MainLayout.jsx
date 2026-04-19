import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/UI';
import { getCurrentUser, getToken, logout } from '../../api/authApi';

const MainLayout = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (!getToken()) {
            setUserName('');
            return;
        }

        let active = true;

        getCurrentUser()
            .then((user) => {
                if (!active) return;
                setUserName(user.nome ?? '');
            })
            .catch(() => {
                if (!active) return;
                logout();
                navigate('/login', { replace: true });
            });

        return () => {
            active = false;
        };
    }, [navigate]);

    const handleLogout = () => {
        logout();
        setUserName('');
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F6F6F8]">
            <Header
                logo={
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-gray-800">Noctua</span>
                        </div>
                    </Link>
                }
                actions={
                    <div className="text-sm text-gray-600 flex items-center gap-6">
                        <Link to="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
                        <Link to="/turmas" className="hover:text-gray-800 transition-colors">Turmas</Link>
                        <p className="hover:cursor-pointer hover:text-gray-800 transition-colors">Ajuda</p>
                        <Link to="/configuracoes" className="hover:text-gray-800 transition-colors">Configurações</Link>
                        <div className="border-l border-gray-300 h-6"></div>
                        <p>{userName || 'Perfil'}</p>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center hover:text-gray-800 transition-colors"
                            aria-label="Sair"
                        >
                            <i className="pi pi-sign-out text-xs hover:cursor-pointer"></i>
                        </button>
                    </div>
                }
                fixed
            />

            <main className="flex-1">
                <div className="max-w-6xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
