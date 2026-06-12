import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Footer = ({ className = '' }) => {
    return (
        <footer className={`w-full border-t border-gray-200 bg-white ${className}`.trim()}>
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col md:flex-row items-center justify-center gap-y-1 gap-x-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                    <p>Noctua</p>
                    <p className="hidden sm:block">Plataforma de análises educacionais</p>
                    <p>&copy; 2026</p>
                    <p className="hidden sm:block">Todos os direitos reservados</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/documentos/politica-de-privacidade"
                        className="transition-colors hover:text-gray-900 hover:underline focus:outline-none focus:font-bold focus:text-secondary focus:underline"
                    >
                        Política de Privacidade
                    </Link>
                    <Link
                        to="/documentos/termos-de-uso"
                        className="transition-colors hover:text-gray-900 hover:underline focus:outline-none focus:font-bold focus:text-secondary focus:underline"
                    >
                        Termos de Uso
                    </Link>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    text: PropTypes.node,
    className: PropTypes.string,
};

export default Footer;
