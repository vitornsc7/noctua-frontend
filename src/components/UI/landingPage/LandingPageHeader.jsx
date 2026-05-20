import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button';

const shortcuts = [
    { label: 'Início', href: '#inicio' },
    { label: 'Por que usar?', href: '#por-que-usar' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Segurança', href: '#seguranca' },
    { label: 'FAQ', href: '#faq' },
];

export default function LandingPageHeader() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleRegister = () => {
        setIsMenuOpen(false);
        navigate('/cadastro');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:gap-6 lg:px-10">
                <div className="flex min-w-0 items-center gap-4 lg:gap-8">
                    <a href="#inicio" className="flex items-center gap-2 text-gray-900">
                        <span className="text-xl font-semibold leading-none">
                            Noctua
                        </span>
                    </a>

                    <nav className="hidden items-center gap-2 lg:flex" aria-label="Atalhos principais">
                        {shortcuts.map((shortcut) => (
                            <a
                                key={shortcut.href}
                                href={shortcut.href}
                                className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                            >
                                {shortcut.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="hidden shrink-0 items-center gap-3 lg:flex">
                    <Link
                        to="/login"
                        className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                    >
                        Entrar
                    </Link>
                    <Button onClick={handleRegister}>
                        Criar conta
                    </Button>
                </div>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-950 lg:hidden"
                    onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
                    aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={isMenuOpen}
                >
                    <i className={`pi ${isMenuOpen ? 'pi-times' : 'pi-bars'} text-sm`} aria-hidden="true" />
                </button>
            </div>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
                    <nav className="grid gap-1" aria-label="Menu da landing page">
                        {shortcuts.map((shortcut) => (
                            <a
                                key={shortcut.href}
                                href={shortcut.href}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {shortcut.label}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                        <Link
                            to="/login"
                            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Entrar
                        </Link>
                        <Button onClick={handleRegister} className="h-9 flex-1 justify-center px-3 py-0 text-sm">
                            Criar conta
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
