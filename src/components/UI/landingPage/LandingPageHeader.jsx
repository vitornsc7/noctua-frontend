import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button';

const shortcuts = ['1', '2', '3', '4'];

export default function LandingPageHeader() {
    const navigate = useNavigate();

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-gray-900">
                        <span className="text-xl font-semibold leading-none">
                            Noctua
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-2 sm:flex" aria-label="Atalhos principais">
                        {shortcuts.map((shortcut) => (
                            <a
                                key={shortcut}
                                href={`#${shortcut}`}
                                className="rounded px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                {shortcut}
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
