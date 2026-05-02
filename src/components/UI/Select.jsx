import React, { forwardRef, useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {string} props.label - Label do select
 * @param {string} props.placeholder - Texto placeholder quando nenhuma opção está selecionada
 * @param {React.ReactNode} props.children - Options como children (usar <Select.Option>)
 * @param {string} props.error - Mensagem de erro
 * @param {boolean} props.disabled - Se o select está desabilitado
 * @param {boolean} props.fullWidth - Se o select ocupa toda a largura disponível
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.helperText - Texto de ajuda abaixo do select
 */
const Select = forwardRef(({
    label,
    placeholder = "Selecione uma opção",
    children,
    error,
    disabled = false,
    isLoading = false,
    fullWidth = false,
    leftIcon,
    className = '',
    helperText,
    required = false,
    value,
    onChange,
    onBlur,
    onFocus,
    ...rest
}, ref) => {
    const hasError = Boolean(error);
    const isBlocked = disabled || isLoading;
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectAreaRef = useRef(null);
    const buttonRef = useRef(ref);
    const dropdownRef = useRef(null);
    const blurTimeoutRef = useRef(null);

    const clearBlurTimeout = () => {
        if (blurTimeoutRef.current) {
            window.clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
        }
    };

    const selectedLabel = useMemo(() => {
        if (!children) {
            return '';
        }

        const childrenArray = React.Children.toArray(children);
        const selected = childrenArray.find((child) => child?.props?.value === value);
        return selected?.props?.children ?? '';
    }, [value, children]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectAreaRef.current && !selectAreaRef.current.contains(event.target)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        if (isOpen) {
            document.addEventListener('mouseup', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        return () => {
            clearBlurTimeout();
        };
    }, []);

    useEffect(() => {
        if (isBlocked) {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    }, [isBlocked]);

    useEffect(() => {
        if (focusedIndex >= 0 && dropdownRef.current) {
            const options = dropdownRef.current.children;
            if (options[focusedIndex]) {
                options[focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedIndex]);

    const handleToggle = () => {
        if (!isBlocked) {
            clearBlurTimeout();
            setIsOpen(!isOpen);
        }
    };

    const handleBlur = (event) => {
        if (!onBlur) {
            return;
        }

        clearBlurTimeout();
        blurTimeoutRef.current = window.setTimeout(() => {
            onBlur(event);
        }, 150);
    };

    const handleFocus = (event) => {
        clearBlurTimeout();
        onFocus?.(event);
    };

    const handleKeyDown = (e) => {
        if (isBlocked) return;

        const childrenArray = React.Children.toArray(children).filter(child => !child.props.disabled);
        const optionsCount = childrenArray.length;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(0);
                } else if (focusedIndex >= 0) {
                    const option = childrenArray[focusedIndex];
                    handleOptionClick(option.props.value);
                }
                break;

            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    setFocusedIndex(-1);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(0);
                } else {
                    setFocusedIndex((prev) => {
                        const next = prev + 1;
                        return next >= optionsCount ? 0 : next;
                    });
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                    setFocusedIndex(optionsCount - 1);
                } else {
                    setFocusedIndex((prev) => {
                        const next = prev - 1;
                        return next < 0 ? optionsCount - 1 : next;
                    });
                }
                break;

            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
                break;

            default:
                break;
        }
    };

    const handleOptionClick = (optionValue) => {
        clearBlurTimeout();

        if (onChange) {
            onChange({ target: { value: optionValue } });
        }
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
    };

    const baseButtonClasses = 'w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors bg-white cursor-pointer text-sm text-left flex items-center';

    const textColorClass = selectedLabel ? 'text-gray-700' : 'text-gray-400';

    const stateClasses = hasError
        ? 'border-red-300 focus:ring-red-200 focus:border-red-300'
        : 'border-gray-300 hover:border-gray-400 focus:ring-primary focus:border-primary';

    const disabledClasses = isBlocked
        ? 'bg-gray-100 cursor-not-allowed opacity-60'
        : '';

    const iconPaddingClasses = [leftIcon ? 'pl-10' : '', 'pr-10']
        .filter(Boolean)
        .join(' ');

    const buttonClasses = `
        ${baseButtonClasses}
        ${textColorClass}
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

            <div className="relative" ref={selectAreaRef}>
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                        {leftIcon}
                    </div>
                )}

                <button
                    ref={buttonRef}
                    type="button"
                    disabled={isBlocked}
                    aria-busy={isLoading}
                    className={buttonClasses}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    {...rest}
                >
                    <span className="block w-full truncate">{selectedLabel || placeholder}</span>
                </button>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {isLoading ? (
                        <i className="pi pi-spin pi-spinner text-sm" aria-hidden="true"></i>
                    ) : (
                        <i className={`pi pi-chevron-down text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                    )}
                </div>

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto p-1"
                    >
                        {React.Children.map(children, (child, index) => {
                            if (!child) return null;

                            const isSelected = child.props.value === value;
                            const isDisabled = child.props.disabled;
                            const isFocused = focusedIndex === index;

                            return (
                                <div
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => !isDisabled && handleOptionClick(child.props.value)}
                                    className={`
                                        flex items-center justify-between
                                        px-3 py-2 rounded-md cursor-pointer transition-colors text-sm outline-none
                                        ${isFocused ? 'bg-gray-100' : 'text-gray-700 hover:bg-gray-100'}
                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <span>{child.props.children}</span>
                                </div>
                            );
                        })}
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

Select.displayName = 'Select';

Select.Option = () => null;

Select.Option.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
};

Select.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    children: PropTypes.node,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    className: PropTypes.string,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
};

export default Select;
