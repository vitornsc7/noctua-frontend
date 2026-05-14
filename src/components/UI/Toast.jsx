import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Toast - Notificação flutuante
 * 
 * @param {Object} props
 * @param {('success'|'error'|'warning'|'info')} props.variant - Tipo da notificação
 * @param {string} props.message - Mensagem principal
 * @param {string} props.description - Descrição adicional (opcional)
 * @param {number} props.duration - Duração em ms (0 = não fecha automaticamente)
 * @param {Function} props.onClose - Callback ao fechar
 */
const Toast = ({
    variant = 'info',
    message,
    description,
    duration = 5000,
    onClose,
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
            }, duration);

            return () => {
                clearTimeout(exitTimer);
            };
        }
    }, []);

    useEffect(() => {
        if (isExiting) {
            const removeTimer = setTimeout(() => {
                onClose?.();
            }, 300);

            return () => {
                clearTimeout(removeTimer);
            };
        }
    }, [isExiting, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    const variantStyles = {
        success: {
            text: 'text-green-800',
            icon: 'pi-check-circle',
        },
        error: {
            text: 'text-red-800',
            icon: 'pi-times-circle',
        },
        warning: {
            text: 'text-yellow-700',
            icon: 'pi-exclamation-triangle',
        },
        info: {
            text: 'text-primary',
            icon: 'pi-info-circle',
        },
    };

    const styles = variantStyles[variant];

    const hasDescription = Boolean(description);

    return (
        <div className={`transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-full' : 'animate-slide-in-right'}`}>
            <div className={`
                bg-white border-gray-200 ${styles.text}
                border rounded-lg pr-12
                ${hasDescription ? 'p-4' : 'px-4 py-3'}
                min-w-[320px] max-w-md
                relative
            `}>
                <div className={`flex gap-3 ${hasDescription ? 'items-start' : 'items-center'}`}>
                    <i className={`pi ${styles.icon} text-lg flex-shrink-0 ${hasDescription ? 'mt-0.5' : ''}`}></i>

                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">
                            {message}
                        </p>
                        {hasDescription && (
                            <p className="text-xs mt-1 opacity-90">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleClose}
                    className={`
                        absolute ${hasDescription ? 'top-3' : 'top-1/2 -translate-y-1/2'} right-3
                        ${styles.text} hover:opacity-70
                        transition-opacity
                        p-1
                    `}
                    aria-label="Fechar notificação"
                >
                    <i className="pi pi-times text-sm"></i>
                </button>
            </div>
        </div>
    );
};

Toast.propTypes = {
    variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    message: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired,
};

export default Toast;
