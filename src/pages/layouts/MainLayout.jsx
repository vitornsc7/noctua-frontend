import React, { useMemo } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const navigate = useNavigate();
    const { user, role, logout } = useAuth();

    const navItems = useMemo(() => {
        if (role === 'ADMIN') {
            return [
                { label: 'Monitoramento operacional', to: '/admin' },
                { label: 'Configurações', to: '/admin/configuracoes' },
            ];
        }

        if (role === 'PROFESSOR') {
            return [
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Turmas', to: '/turmas' },
                { label: 'Configurações', to: '/configuracoes' },
            ];
        }

        return [];
    }, [role]);

    const homeLink = role === 'ADMIN' ? '/admin' : '/dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F6F6F8]">
            <Header
                logo={
                    <Link to={homeLink}>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-gray-800">Noctua</span>
                        </div>
                    </Link>
                }
                actions={
                    <div className="text-sm text-gray-600 flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link key={item.to} to={item.to} className="hover:text-gray-800 transition-colors">
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-l border-gray-300 h-6"></div>
                        <p>{user?.nome || 'Perfil'}</p>
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
