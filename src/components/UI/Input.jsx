import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CONTROL_KEYS = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
]);

const getMaskSlotsCount = (mask) => (mask ? (mask.match(/\*/g) || []).length : 0);

const sanitizeByMode = (value, { numericOnly, integerOnly }) => {
    const input = String(value ?? '');

    if (integerOnly) {
        return input.replace(/\D/g, '');
    }

    if (!numericOnly) {
        return input;
    }

    const normalized = input
        .replace(/,/g, '.')
        .replace(/[^\d.]/g, '');

    const [whole = '', ...decimalParts] = normalized.split('.');
    if (decimalParts.length === 0) {
        return whole;
    }

    return `${whole}.${decimalParts.join('')}`;
};

const applyMask = (value, mask, digitsOnly) => {
    if (!mask) {
        return value;
    }

    const allowedPattern = digitsOnly ? /\d/ : /[0-9a-zA-Z]/;
    const rawChars = String(value ?? '')
        .split('')
        .filter((char) => allowedPattern.test(char));

    let rawIndex = 0;
    let output = '';

    for (let i = 0; i < mask.length; i += 1) {
        const maskChar = mask[i];

        if (maskChar === '*') {
            if (rawIndex >= rawChars.length) {
                break;
            }

            output += rawChars[rawIndex];
            rawIndex += 1;
            continue;
        }

        if (rawIndex < rawChars.length) {
            output += maskChar;
        }
    }

    return output;
};

const normalizeValue = (value, {
    numericOnly,
    integerOnly,
    mask,
    maxChars,
}) => {
    const withMode = sanitizeByMode(value, { numericOnly, integerOnly });
    const parsedMaxChars = Number.isInteger(maxChars) && maxChars >= 0 ? maxChars : undefined;
    const maskSlots = getMaskSlotsCount(mask);

    if (!mask) {
        return parsedMaxChars != null ? withMode.slice(0, parsedMaxChars) : withMode;
    }

    const maxRawLength = parsedMaxChars != null
        ? Math.min(parsedMaxChars, maskSlots)
        : maskSlots;
    const shouldRestrictDigits = integerOnly || numericOnly;
    const rawPattern = shouldRestrictDigits ? /\d/ : /[0-9a-zA-Z]/;
    const rawOnly = withMode.split('').filter((c) => rawPattern.test(c)).join('');
    const raw = rawOnly.slice(0, maxRawLength);

    return applyMask(raw, mask, shouldRestrictDigits);
};

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
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    helperText,
    required = false,
    numericOnly = false,
    integerOnly = false,
    mask,
    maxChars,
    min,
    max,
    step = 1,
    value,
    onChange,
    onKeyDown,
    minLength,
    maxLength,
    ...rest
}, ref) => {
    const hasError = Boolean(error);
    const isBlocked = disabled || isLoading;

    const numValue = integerOnly ? (Number(value) || 0) : 0;
    const canIncrement = integerOnly && !isBlocked && (max == null || numValue < Number(max));
    const canDecrement = integerOnly && !isBlocked && (min == null || numValue > Number(min));

    const increment = () => {
        if (!canIncrement) return;
        onChange?.({ target: { value: String(numValue + step) } });
    };

    const decrement = () => {
        if (!canDecrement) return;
        onChange?.({ target: { value: String(numValue - step) } });
    };

    const baseInputClasses = 'w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary bg-white text-sm';

    const stateClasses = hasError
        ? 'border-red-300 focus:ring-red-200 focus:border-red-300 bg-error'
        : 'border-gray-300 focus:ring-primary focus:border-primary';

    const disabledClasses = isBlocked
        ? 'bg-gray-100 cursor-not-allowed opacity-60'
        : '';

    const iconPaddingClasses = [leftIcon ? 'pl-10' : '', integerOnly ? 'pr-8' : (rightIcon || isLoading ? 'pr-10' : '')]
        .filter(Boolean)
        .join(' ');

    const inputClasses = `
    ${baseInputClasses}
    ${stateClasses}
    ${disabledClasses}
    ${iconPaddingClasses}
  `.trim().replace(/\s+/g, ' ');

    const containerClasses = fullWidth ? 'w-full' : '';

    const parsedMaxChars = Number.isInteger(maxChars) && maxChars >= 0 ? maxChars : undefined;

    const resolvedMinLength = Number.isInteger(minLength) && minLength >= 0
        ? minLength
        : undefined;

    const resolvedMaxLength = [
        maxLength,
        mask ? mask.length : undefined,
        !mask ? parsedMaxChars : undefined,
    ]
        .filter((value) => Number.isInteger(value) && value >= 0)
        .reduce((acc, value) => (acc == null ? value : Math.min(acc, value)), undefined);

    const handleChange = (event) => {
        const normalized = normalizeValue(event.target.value, {
            numericOnly,
            integerOnly,
            mask,
            maxChars: parsedMaxChars,
        });

        if (normalized !== event.target.value) {
            event.target.value = normalized;
        }

        onChange?.(event);
    };

    const handleKeyDown = (event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || isBlocked) {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey || CONTROL_KEYS.has(event.key) || event.key.length !== 1) {
            return;
        }

        const shouldRestrictDigits = integerOnly || numericOnly;
        const isDigit = /\d/.test(event.key);

        if (shouldRestrictDigits) {
            const isDecimalSeparator = event.key === '.' || event.key === ',';
            if (integerOnly && !isDigit) {
                event.preventDefault();
                return;
            }

            if (numericOnly) {
                if (!isDigit && !isDecimalSeparator) {
                    event.preventDefault();
                    return;
                }

                const currentValue = String(event.currentTarget.value ?? '');
                if (isDecimalSeparator && /[.,]/.test(currentValue)) {
                    event.preventDefault();
                    return;
                }
            }
        }

        if (mask) {
            const currentValue = String(event.currentTarget.value ?? '');
            const slots = getMaskSlotsCount(mask);
            const rawPattern = shouldRestrictDigits ? /\d/g : /[0-9a-zA-Z]/g;
            const rawCount = (currentValue.match(rawPattern) || []).length;

            const maxByMask = parsedMaxChars != null ? Math.min(parsedMaxChars, slots) : slots;
            if (rawCount >= maxByMask) {
                event.preventDefault();
            }
        }
    };

    const inputMode = integerOnly
        ? 'numeric'
        : numericOnly
            ? 'decimal'
            : rest.inputMode;

    const trailingIcon = isLoading
        ? <i className="pi pi-spin pi-spinner text-sm" aria-hidden="true"></i>
        : rightIcon;

    return (
        <div className={`flex flex-col gap-1.5 ${containerClasses} ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {integerOnly ? (
                <div
                    className={`
                        flex rounded-lg border overflow-hidden
                        ${hasError ? 'border-red-300 focus-within:border-red-300' : 'border-gray-300 focus-within:border-primary'}
                        ${isBlocked ? 'opacity-60' : ''}
                    `}
                >
                    {leftIcon && (
                        <div className="pl-3 flex items-center text-gray-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        disabled={isBlocked}
                        aria-busy={isLoading}
                        className={`flex-1 px-4 py-2 bg-white text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isBlocked ? 'bg-gray-100 cursor-not-allowed' : ''} ${leftIcon ? 'pl-2' : ''}`}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        inputMode="numeric"
                        {...rest}
                    />
                    <div className="flex flex-col w-7 border-l border-gray-300 select-none">
                        <button
                            type="button"
                            onClick={increment}
                            disabled={!canIncrement}
                            tabIndex={-1}
                            aria-label="Aumentar"
                            className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                        >
                            <i className="pi pi-chevron-up text-[9px] text-gray-500" aria-hidden="true" />
                        </button>
                        <div className="h-px bg-gray-300" />
                        <button
                            type="button"
                            onClick={decrement}
                            disabled={!canDecrement}
                            tabIndex={-1}
                            aria-label="Diminuir"
                            className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default"
                        >
                            <i className="pi pi-chevron-down text-[9px] text-gray-500" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        disabled={isBlocked}
                        aria-busy={isLoading}
                        className={inputClasses}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        minLength={resolvedMinLength}
                        maxLength={resolvedMaxLength}
                        inputMode={inputMode}
                        {...rest}
                    />

                    {trailingIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {trailingIcon}
                        </div>
                    )}
                </div>
            )}

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
    isLoading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    numericOnly: PropTypes.bool,
    integerOnly: PropTypes.bool,
    mask: PropTypes.string,
    maxChars: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
};

export default Input;
