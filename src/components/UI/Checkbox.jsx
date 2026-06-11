import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    error,
    variant = 'square',
    className = '',
    tooltip,
    ...rest
}) => {
    const shape = variant === 'circle' ? `rounded-full h-5 w-5 ${checked
        ? 'border-none'
        : 'border-gray-400'
        }` : 'rounded-sm';

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label
                className={`flex items-center gap-2 text-sm select-none
                    ${disabled ? 'opacity-50' : 'cursor-pointer text-gray-600'}
                `}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!disabled) onChange?.({ target: { checked: !checked } });
                    }
                }}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only peer"
                    {...rest}
                />
                <div
                    className={`
                        w-4 h-4
                        border ${shape}
                        flex items-center justify-center
                        peer-focus-visible:ring-2 peer-focus-visible:ring-gray-700 peer-focus-visible:ring-offset-2
                        ${checked
                            ? 'bg-gray-700 border-gray-700'
                            : 'border-gray-400'
                        }
                    `}
                >
                    {checked && <i className="pi pi-check text-white text-[10px]" />}
                </div>
                {label}
                {tooltip && (
                    <Tooltip content={tooltip}>
                        <i className="pi pi-info-circle text-sm text-gray-400 cursor-default" />
                    </Tooltip>
                )}
            </label>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};

Checkbox.propTypes = {
    label: PropTypes.node,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    tooltip: PropTypes.string,
    variant: PropTypes.oneOf(['square', 'circle']),
    className: PropTypes.string,
};

export default Checkbox;
