import React, { useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, role, logout } = useAuth();

    const navItems = useMemo(() => {
        if (role === 'ADMIN') {
            return [
                { label: 'Monitoramento operacional', to: '/admin' },
                //{ label: 'Configurações', to: '/admin/configuracoes' },
            ];
        }

        if (role === 'PROFESSOR') {
            return [
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Turmas', to: '/turmas' },
                { label: 'Ajuda', to: '/ajuda' },
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
        <div className="flex h-screen flex-col bg-[#F6F6F8] overflow-hidden">
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
                        {navItems.map((item) => {
                            const isActive =
                                location.pathname === item.to ||
                                location.pathname.startsWith(item.to + '/');
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={[
                                        'relative text-sm border-b-2 pt-1 pb-0.5 transition-colors',
                                        isActive
                                            ? 'border-primary text-gray-800 font-medium'
                                            : 'border-transparent text-gray-600 hover:text-gray-800',
                                    ].join(' ')}
                                >
                                    <span aria-hidden className="invisible font-medium">{item.label}</span>
                                    <span className="absolute inset-0 flex items-center justify-center">{item.label}</span>
                                </Link>
                            );
                        })}
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

            <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
                <div className="max-w-6xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
