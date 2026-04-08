import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    error,
    className = '',
    ...rest
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className={`flex items-center gap-2 text-sm cursor-pointer select-none ${disabled ? 'opacity-50' : 'text-gray-600'}`}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                    w-4 h-4 
                    accent-gray-700 
                    border border-gray-400 
                    rounded 
                    cursor-pointer
                    `}
                    {...rest}
                />
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
    className: PropTypes.string,
};

export default Checkbox;
