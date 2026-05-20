import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Footer = ({ className = '' }) => {
    return (
        <footer className={`w-full border-t border-gray-200 bg-white ${className}`.trim()}>
            <div className="mx-auto max-w-6xl px-4 py-3 text-center flex justify-center align-middle gap-3 text-sm text-gray-600">
                <p>Noctua</p>
                <p>Plataforma de analises educacionais</p>
                <p>&copy; 2026</p>
                <p>Todos os direitos reservados</p>
                <Link
                    to="/documentos/politica-de-privacidade"
                    className="transition-colors hover:text-gray-900 hover:underline"
                >
                    Política de Privacidade
                </Link>
                <Link
                    to="/documentos/termos-de-uso"
                    className="transition-colors hover:text-gray-900 hover:underline"
                >
                    Termos de Uso
                </Link>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    text: PropTypes.node,
    className: PropTypes.string,
};

export default Footer;
