import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.logo - Logo ou título do header
 * @param {React.ReactNode} props.children - Conteúdo do centro (menu, navegação)
 * @param {React.ReactNode} props.actions - Ações à direita (botões, perfil, etc)
 * @param {boolean} props.fixed - Se o header fica fixo no topo
 * @param {string} props.className - Classes CSS adicionais
 */
const Header = ({
    logo,
    children,
    actions,
    fixed = false,
    className = '',
}) => {
    const baseClasses = 'w-full bg-white border-b border-gray-200 transition-all';
    const fixedClasses = fixed ? 'sticky top-0 z-50' : '';

    const headerClasses = `${baseClasses} ${fixedClasses} ${className}`.trim();

    return (
        <header className={headerClasses}>
            <div className="max-w-6xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between gap-6">
                    {logo && (
                        <div className="flex-shrink-0">
                            {logo}
                        </div>
                    )}

                    {children && (
                        <div className="flex-1 flex items-center justify-center">
                            {children}
                        </div>
                    )}

                    {actions && (
                        <div className="flex-shrink-0 flex items-center gap-3">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    logo: PropTypes.node,
    children: PropTypes.node,
    actions: PropTypes.node,
    fixed: PropTypes.bool,
    className: PropTypes.string,
};

export default Header;
