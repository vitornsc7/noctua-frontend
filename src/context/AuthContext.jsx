import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getCurrentUser, isTokenValid, logout as clearSession } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const syncAuth = async () => {
            if (!isTokenValid()) {
                if (!active) return;
                setUser(null);
                setLoading(false);
                return;
            }

            if (active) {
                setLoading(true);
            }

            try {
                const currentUser = await getCurrentUser();
                if (!active) return;
                setUser(currentUser);
            } catch {
                if (!active) return;
                clearSession();
                setUser(null);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        syncAuth();

        const handleAuthChange = () => {
            syncAuth();
        };

        window.addEventListener('auth-change', handleAuthChange);

        return () => {
            active = false;
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    const value = useMemo(() => ({
        user,
        role: user?.role ?? null,
        isAuthenticated: Boolean(user),
        loading,
        logout: () => {
            clearSession();
            setUser(null);
        },
    }), [loading, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }

    return context;
};