import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((variant, message, description = '', duration = 5000) => {
        const id = Date.now() + Math.random();
        const createdAt = Date.now();
        setToasts((prev) => [...prev, { id, variant, message, description, duration, createdAt }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, description, duration) => addToast('success', message, description, duration), [addToast]);
    const showError = useCallback((message, description, duration) => addToast('error', message, description, duration), [addToast]);
    const showWarning = useCallback((message, description, duration) => addToast('warning', message, description, duration), [addToast]);
    const showInfo = useCallback((message, description, duration) => addToast('info', message, description, duration), [addToast]);

    const contextValue = useMemo(
        () => ({ addToast, showSuccess, showError, showWarning, showInfo }),
        [addToast, showSuccess, showError, showWarning, showInfo],
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto"
                    >
                        <Toast
                            variant={toast.variant}
                            message={toast.message}
                            description={toast.description}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
