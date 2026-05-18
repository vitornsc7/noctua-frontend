import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button';

const shortcuts = [
    { label: 'Início', href: '#inicio' },
    { label: 'FAQ', href: '#faq' },
];

export default function LandingPageHeader() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-10 py-2">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-gray-900">
                        <span className="text-xl font-semibold leading-none">
                            Noctua
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-2 sm:flex" aria-label="Atalhos principais">
                        {shortcuts.map((shortcut) => (
                            <a
                                key={shortcut.href}
                                href={shortcut.href}
                                className="rounded px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                {shortcut.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        Entrar
                    </Link>
                    <Button onClick={() => navigate('/cadastro')}>
                        Criar conta
                    </Button>
                </div>
            </div>
        </header>
    );
}
