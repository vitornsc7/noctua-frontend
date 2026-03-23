import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Button - Botão reutilizável com múltiplas variantes
 * 
 * @param {Object} props
 * @param {('primary'|'outline')} props.variant - Variante visual do botão
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {boolean} props.fullWidth - Se o botão ocupa toda a largura disponível
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda do texto
 * @param {React.ReactNode} props.rightIcon - Ícone à direita do texto
 * @param {Function} props.onClick - Função executada ao clicar
 * @param {string} props.className - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Conteúdo do botão
 */
const Button = ({
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    className = '',
    children,
    type = 'button',
    ...rest
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg focus:outline-none px-3 py-1.5 text-sm';

    const variantClasses = {
        primary: 'bg-primary text-white disabled:bg-gray-300 disabled:text-gray-600 disabled:opacity-50 focus:bg-secondary hover:bg-secondary',
        outline: 'border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 focus:bg-gray-100',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
            {...rest}
        >
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'outline']),
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
