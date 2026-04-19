const BASE_URL = '/api';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const logout = () => {
    localStorage.removeItem('token');
};

const getAuthHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const parseResponseBody = async (response) => {
    const contentType = response.headers.get('content-type') ?? '';

    if (response.status === 204) {
        return null;
    }

    if (contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};

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

    return await response.json();
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

    return await response.json();
};

export const getCurrentUser = async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }

    return await response.json();
};

export const setup2FA = async () => {
    const response = await fetch(`${BASE_URL}/2fa/setup`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }

    return await parseResponseBody(response);
    // esperado:
    // { secret, otpauthUrl }
};

export const verifySetup2FA = async (code) => {
    const response = await fetch(`${BASE_URL}/2fa/verify-setup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Erro HTTP ${response.status}`);
    }

    return await parseResponseBody(response);
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || `Erro HTTP ${response.status}`);
    }

    return data;
};

export const resetPassword = async ({ token, novaSenha, confirmacaoSenha }) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha, confirmacaoSenha }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || `Erro HTTP ${response.status}`);
    }

    return data;
};