import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.header - Conteúdo do cabeçalho do card
 * @param {React.ReactNode} props.children - Conteúdo principal do card
 * @param {React.ReactNode} props.footer - Conteúdo do rodapé do card
 * @param {('default'|'outlined'|'flat')} props.variant - Variante visual do card
 * @param {boolean} props.hoverable - Se o card tem efeito hover
 * @param {Function} props.onClick - Função executada ao clicar (torna o card clicável)
 * @param {string} props.className - Classes CSS adicionais
 */
const Card = ({
    header,
    children,
    footer,
    variant = 'default',
    onClick,
    className = '',
    ...rest
}) => {
    const isClickable = Boolean(onClick);

    const baseClasses = 'rounded-lg transition-all duration-200';

    const variantClasses = {
        default: 'bg-white border border-gray-200',
        flat: 'bg-gray-50',
    };

    const clickableClasses = isClickable
        ? 'cursor-pointer'
        : '';

    const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const CardWrapper = isClickable ? 'button' : 'div';

    return (
        <CardWrapper
            className={cardClasses}
            onClick={onClick}
            type={isClickable ? 'button' : undefined}
            {...rest}
        >
            {header && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {header}
                </div>
            )}

            <div className="px-6 py-4">
                {children}
            </div>

            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {footer}
                </div>
            )}
        </CardWrapper>
    );
};

Card.propTypes = {
    header: PropTypes.node,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'flat']),
    hoverable: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

Card.Header = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

Card.Header.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

Card.Body = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

Card.Body.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

Card.Footer = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
        {children}
    </div>
);

Card.Footer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Card;
