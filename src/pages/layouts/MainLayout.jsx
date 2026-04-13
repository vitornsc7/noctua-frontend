import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header, Footer } from '../../components/UI';

const MainLayout = () => {
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
                        <p>Prof. Julio</p>
                        <i className="pi pi-sign-out text-xs hover:cursor-pointer hover:text-gray-800 transition-colors"></i>
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
