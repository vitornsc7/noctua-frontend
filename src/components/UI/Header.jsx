import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.logo - Logo ou título do header
 * @param {React.ReactNode} props.children - Conteúdo do centro (menu, navegação)
 * @param {React.ReactNode} props.actions - Ações à direita (botões, perfil, etc)
 * @param {Function} props.mobileMenuContent - Render prop para o conteúdo do menu mobile: ({ closeMenu }) => ReactNode
 * @param {boolean} props.fixed - Se o header fica fixo no topo
 * @param {string} props.className - Classes CSS adicionais
 */
const Header = ({
    logo,
    children,
    actions,
    mobileMenuContent,
    fixed = false,
    className = '',
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const hasMobileMenu = Boolean(mobileMenuContent);

    const baseClasses = 'w-full bg-white border-b border-gray-200 transition-all';
    const fixedClasses = fixed ? 'sticky top-0 z-50' : '';

    const headerClasses = `${baseClasses} ${fixedClasses} ${className}`.trim();

    const closeMenu = () => setIsMenuOpen(false);

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
                        <div className={`flex-1 flex items-center justify-center ${hasMobileMenu ? 'hidden lg:flex' : ''}`}>
                            {children}
                        </div>
                    )}

                    {actions && (
                        <div className={`flex-shrink-0 flex items-center gap-3 ${hasMobileMenu ? 'hidden lg:flex' : ''}`}>
                            {actions}
                        </div>
                    )}

                    {hasMobileMenu && (
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-950 lg:hidden"
                            onClick={() => setIsMenuOpen((v) => !v)}
                            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                            aria-expanded={isMenuOpen}
                        >
                            <i className={`pi ${isMenuOpen ? 'pi-times' : 'pi-bars'} text-sm`} aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            {hasMobileMenu && isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
                    {mobileMenuContent({ closeMenu })}
                </div>
            )}
        </header>
    );
};

Header.propTypes = {
    logo: PropTypes.node,
    children: PropTypes.node,
    actions: PropTypes.node,
    mobileMenuContent: PropTypes.func,
    fixed: PropTypes.bool,
    className: PropTypes.string,
};

export default Header;
