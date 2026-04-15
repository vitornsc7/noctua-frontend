const BASE_URL = '/api';

export const login = async ({ email, senha, rememberMe = false }) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, rememberMe }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
};

export const verifyLogin2FA = async ({ email, senha, code, rememberMe = false }) => {
    const response = await fetch(`${BASE_URL}/auth/2fa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, code, rememberMe }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');