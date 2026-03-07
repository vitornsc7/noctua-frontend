import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo da tag
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {React.ReactNode} props.rightIcon - Ícone à direita
 * @param {string} props.className - Classes CSS adicionais
 */
const Tag = ({
    children,
    leftIcon,
    rightIcon,
    className = '',
    ...rest
}) => {
    const classes = `
        inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200
        border border-gray-300 text-gray-600 bg-[#F1F5F9]
        px-2 py-0.5 text-sm
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <span className={classes} {...rest}>
            {leftIcon && (
                <span className="flex-shrink-0 text-xs">
                    {leftIcon}
                </span>
            )}

            <span className="truncate">{children}</span>

            {rightIcon && (
                <span className="flex-shrink-0 text-xs">
                    {rightIcon}
                </span>
            )}
        </span>
    );
};

Tag.propTypes = {
    children: PropTypes.node.isRequired,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
};

export default Tag;
