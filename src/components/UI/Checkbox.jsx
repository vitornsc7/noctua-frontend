import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    error,
    variant = 'square',
    className = '',
    ...rest
}) => {
    const shape = variant === 'circle' ? 'rounded-full' : 'rounded-sm';

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label
                className={`flex items-center gap-2 text-sm select-none
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer text-gray-600'}
                `}
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
                        peer-focus-visible:ring-2 peer-focus-visible:ring-gray-700 peer-focus-visible:ring-offset-1
                        ${checked
                            ? 'bg-gray-700 border-gray-700'
                            : 'border-gray-400'
                        }
                    `}
                >
                    {checked && <i className="pi pi-check text-white text-[10px]" />}
                </div>
                {label}
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
    variant: PropTypes.oneOf(['square', 'circle']),
    className: PropTypes.string,
};

export default Checkbox;
