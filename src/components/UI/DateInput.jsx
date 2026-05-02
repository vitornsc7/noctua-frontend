import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    today: 'Hoje',
    clear: 'Limpar',
});

const toDate = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const toISODate = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const DateInput = ({
    label,
    value = '',
    onChange,
    disabled = false,
    required = false,
    error,
    helperText,
    fullWidth = false,
    placeholder = 'dd/mm/aaaa',
    minDate,
    maxDate,
    className = '',
    ...rest
}) => {
    const hasError = Boolean(error);

    const handleChange = (e) => {
        onChange?.({ target: { value: e.value ? toISODate(e.value) : '' } });
    };

    const inputClass = [
        'w-full pl-4 pr-10 py-2 rounded-lg border focus:outline-none bg-white text-sm text-gray-700 placeholder-gray-400',
        hasError ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-primary',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <Calendar
                    value={toDate(value)}
                    onChange={handleChange}
                    dateFormat="dd/mm/yy"
                    locale="pt-BR"
                    placeholder={placeholder}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    inputClassName={inputClass}
                    inputStyle={{ boxShadow: 'none' }}
                    pt={{
                        root: { className: fullWidth ? 'w-full' : '' },
                        panel: { className: 'text-xs font-sans' },
                        header: { className: 'py-1.5 px-2' },
                        title: { className: 'text-xs flex items-center gap-1' },
                        monthTitle: { className: 'text-xs capitalize' },
                        yearTitle: { className: 'text-xs' },
                        table: { className: 'text-xs' },
                        day: { className: 'p-0' },
                        dayLabel: { className: 'w-7 h-7 text-xs' },
                    }}
                    {...rest}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="pi pi-calendar text-sm" aria-hidden="true" />
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
};

DateInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    error: PropTypes.string,
    helperText: PropTypes.string,
    fullWidth: PropTypes.bool,
    placeholder: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    className: PropTypes.string,
};

export default DateInput;
