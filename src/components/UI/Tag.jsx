import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const extractText = (node) => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node)) return extractText(node.props.children ?? null);
    return '';
};

const truncateChildren = (children, maxChars) =>
    React.Children.map(children, (child) => {
        if (typeof child === 'string' && child.length > maxChars) {
            return `${child.slice(0, maxChars)}\u2026`;
        }
        return child;
    });

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo da tag
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {React.ReactNode} props.rightIcon - Ícone à direita
 * @param {number} props.maxChars - Limite de caracteres antes de truncar (opcional)
 * @param {string} props.className - Classes CSS adicionais
 */
const Tag = ({
    children,
    leftIcon,
    rightIcon,
    maxChars,
    className = '',
    ...rest
}) => {
    const fullText = extractText(children);
    const isOverflow = maxChars != null && fullText.length > maxChars;

    const classes = `
        inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200
        border border-gray-300 text-gray-600 bg-[#F1F5F9]
        px-2 py-0.5 text-sm
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const tag = (
        <span className={classes} {...rest}>
            {leftIcon && (
                <span className="flex-shrink-0 text-xs">
                    {leftIcon}
                </span>
            )}

            <span className="break-words">
                {isOverflow ? truncateChildren(children, maxChars) : children}
            </span>

            {rightIcon && (
                <span className="flex-shrink-0 text-xs">
                    {rightIcon}
                </span>
            )}
        </span>
    );

    if (isOverflow) {
        return <Tooltip content={fullText}>{tag}</Tooltip>;
    }

    return tag;
};

Tag.propTypes = {
    children: PropTypes.node.isRequired,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    maxChars: PropTypes.number,
    className: PropTypes.string,
};

export default Tag;
