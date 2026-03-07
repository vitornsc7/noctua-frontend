import React, { forwardRef, useState, useRef, useEffect } from 'react';
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
    fullWidth = false,
    leftIcon,
    className = '',
    helperText,
    required = false,
    value,
    onChange,
    ...rest
}, ref) => {
    const hasError = Boolean(error);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectAreaRef = useRef(null);
    const buttonRef = useRef(ref);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (value && children) {
            const childrenArray = React.Children.toArray(children);
            const selected = childrenArray.find(child => child.props.value === value);
            if (selected) {
                setSelectedLabel(selected.props.children);
            }
        } else {
            setSelectedLabel('');
        }
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

    // Scroll para a opção focada
    useEffect(() => {
        if (focusedIndex >= 0 && dropdownRef.current) {
            const options = dropdownRef.current.children;
            if (options[focusedIndex]) {
                options[focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedIndex]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

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
                    handleOptionClick(option.props.value, option.props.children);
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

    const handleOptionClick = (optionValue, optionLabel) => {
        if (onChange) {
            onChange({ target: { value: optionValue } });
        }
        setSelectedLabel(optionLabel);
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
    };

    const baseButtonClasses = 'w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-primary bg-white cursor-pointer text-sm text-left flex items-center justify-between';

    const textColorClass = selectedLabel ? 'text-gray-700' : 'text-gray-400';

    const stateClasses = hasError
        ? 'border-red-300 focus:ring-2 focus:ring-red-200 bg-error'
        : 'border-gray-300 focus:border-primary';

    const disabledClasses = disabled
        ? 'bg-gray-100 cursor-not-allowed opacity-60'
        : '';

    const iconPaddingClasses = leftIcon ? 'pl-10' : '';

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
                    disabled={disabled}
                    className={buttonClasses}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    {...rest}
                >
                    <span className="truncate">{selectedLabel || placeholder}</span>
                    <i className={`pi pi-chevron-down text-sm text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                        {React.Children.map(children, (child, index) => {
                            if (!child) return null;

                            const isSelected = child.props.value === value;
                            const isDisabled = child.props.disabled;
                            const isFocused = focusedIndex === index;

                            return (
                                <div
                                    onClick={() => !isDisabled && handleOptionClick(child.props.value, child.props.children)}
                                    className={`
                                        px-4 py-2.5 cursor-pointer transition-colors text-sm outline-none
                                        ${isSelected ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' : 'text-gray-700 hover:bg-gray-50'}
                                        ${isFocused ? 'bg-gray-100 border-l-2 border-gray-400' : ''}
                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {child.props.children}
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

Select.Option = ({ value, children, disabled = false }) => null;

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
    fullWidth: PropTypes.bool,
    leftIcon: PropTypes.node,
    className: PropTypes.string,
    helperText: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

export default Select;
