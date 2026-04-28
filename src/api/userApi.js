const BASE_URL = "/api";

export async function getMe(token) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao buscar usuário");
    return res.json();
}

export async function updateMe(token, data) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar usuário");
    return res.json();
}

export async function deleteMe(token) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao excluir conta");
}