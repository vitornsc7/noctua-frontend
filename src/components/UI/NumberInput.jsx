import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {string} props.label - Label do input
 * @param {number|string} props.value - Valor atual
 * @param {Function} props.onChange - Callback com evento sintético { target: { value } }
 * @param {number} props.min - Valor mínimo
 * @param {number} props.max - Valor máximo
 * @param {number} props.step - Incremento por clique (padrão: 1)
 * @param {boolean} props.disabled - Se desabilitado
 * @param {boolean} props.required - Se obrigatório
 * @param {string} props.error - Mensagem de erro
 * @param {string} props.helperText - Texto auxiliar
 * @param {boolean} props.fullWidth - Ocupa toda a largura disponível
 * @param {string} props.className - Classes adicionais
 */
const NumberInput = forwardRef(({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    isLoading = false,
    required = false,
    error,
    helperText,
    fullWidth = false,
    className = '',
    ...rest
}, ref) => {
    const numValue = Number(value) || 0;
    const isBlocked = disabled || isLoading;
    const hasError = Boolean(error);

    const containerClasses = fullWidth ? 'w-full' : '';

    const inputClasses = [
        'w-full px-4 py-2 pr-8 rounded-lg border focus:outline-none bg-white text-sm',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        hasError
            ? 'border-red-300 focus:border-red-300 bg-red-50'
            : 'border-gray-300 focus:border-primary',
        isBlocked ? 'bg-gray-100 cursor-not-allowed opacity-60' : '',
    ].filter(Boolean).join(' ');

    const handleChange = (e) => {
        onChange?.(e);
    };

    const dispatch = (newVal) => {
        onChange?.({ target: { value: String(newVal) } });
    };

    const canIncrement = !isBlocked && (max === undefined || max === null || numValue < Number(max));
    const canDecrement = !isBlocked && (min === undefined || min === null || numValue > Number(min));

    const increment = () => {
        if (!canIncrement) return;
        dispatch(numValue + step);
    };

    const decrement = () => {
        if (!canDecrement) return;
        dispatch(numValue - step);
    };

    return (
        <div className={`flex flex-col gap-1.5 ${containerClasses} ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    type="number"
                    value={value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                    disabled={isBlocked}
                    className={inputClasses}
                    {...rest}
                />

                {/* Custom spinner arrows */}
                <div className="absolute right-0 top-0 h-full flex flex-col w-7 border-l border-gray-300 select-none">
                    <button
                        type="button"
                        onClick={increment}
                        disabled={!canIncrement}
                        tabIndex={-1}
                        aria-label="Aumentar"
                        className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default rounded-tr-lg"
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
                        className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default rounded-br-lg"
                    >
                        <i className="pi pi-chevron-down text-[9px] text-gray-500" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {helperText && !error && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}

            {error && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <i className="pi pi-exclamation-circle text-xs" aria-hidden="true" />
                    {error}
                </p>
            )}
        </div>
    );
});

NumberInput.displayName = 'NumberInput';

NumberInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    helperText: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default NumberInput;
