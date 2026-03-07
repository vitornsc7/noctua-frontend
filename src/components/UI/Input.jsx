import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/** 
 * @param {Object} props
 * @param {string} props.label - Label do input
 * @param {string} props.placeholder - Placeholder do input
 * @param {string} props.type - Tipo do input (text, email, password, etc)
 * @param {string} props.error - Mensagem de erro
 * @param {boolean} props.disabled - Se o input está desabilitado
 * @param {boolean} props.fullWidth - Se o input ocupa toda a largura disponível
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {React.ReactNode} props.rightIcon - Ícone à direita
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.helperText - Texto de ajuda abaixo do input
 */
const Input = forwardRef(({
    label,
    placeholder,
    type = 'text',
    error,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    helperText,
    required = false,
    ...rest
}, ref) => {
    const hasError = Boolean(error);

    const baseInputClasses = 'w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary bg-white text-sm';

    const stateClasses = hasError
        ? 'border-red-300 focus:ring-red-200 focus:border-red-300 bg-error'
        : 'border-gray-300 focus:ring-primary focus:border-primary';

    const disabledClasses = disabled
        ? 'bg-gray-100 cursor-not-allowed opacity-60'
        : '';

    const iconPaddingClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${disabledClasses}
    ${iconPaddingClasses}
  `.trim().replace(/\s+/g, ' ');

    const containerClasses = fullWidth ? 'w-full' : '';

    return (
        <div className={`flex flex-col gap-1.5 ${containerClasses} ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    {...rest}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>

            {helperText && !error && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}

            {error && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <i className="pi pi-exclamation-circle text-xs"></i>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    helperText: PropTypes.string,
    required: PropTypes.bool,
};

export default Input;
