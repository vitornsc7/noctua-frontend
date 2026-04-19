import { Link } from 'react-router-dom';
import corujinha from '../assets/corujinha.png';
import { useAuth } from '../context/AuthContext';

export default function ForbiddenPage() {
    const { role } = useAuth();

    const homePath = role === 'ADMIN' ? '/admin' : role === 'PROFESSOR' ? '/dashboard' : '/login';

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f7f9] px-6 text-center">
            <img
                src={corujinha}
                alt="Logo Noctua"
                className="w-16 h-16 object-contain mb-4 opacity-40"
            />
            <h1 className="text-7xl font-semibold text-gray-200 tracking-tight leading-none select-none">
                403
            </h1>
            <p className="mt-3 text-xl font-medium text-gray-700">
                Você não tem permissão para acessar esta área.
            </p>
            <p className="mt-1 text-sm text-gray-400">
                O seu perfil não pode acessar esta rota no momento.
            </p>
            <Link
                to={homePath}
                className="mt-6 text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
                Voltar para o início
            </Link>
        </div>
    );
}