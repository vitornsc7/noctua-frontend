import { Link } from 'react-router-dom';
import corujinha from '../assets/corujinha.png';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#f6f7f9] px-6 text-center">
            <img
                src={corujinha}
                alt="Logo Noctua"
                className="w-16 h-16 object-contain mb-4 opacity-40"
            />
            <h1 className="text-7xl font-semibold text-gray-200 tracking-tight leading-none select-none">
                404
            </h1>
            <p className="mt-3 text-xl font-medium text-gray-700">
                Ops, parece que você não deveria estar aqui.
            </p>
            <p className="mt-1 text-sm text-gray-400">
                A página que você procura não existe ou foi movida.
            </p>
            <Link
                to="/"
                className="mt-6 text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors"
            >
                Voltar para o início
            </Link>
        </div>
    );
}
