import React, { useEffect, useState } from 'react';
import { Button, Modal } from '../../../components/UI';
import { getMe, updateMe, deleteMe } from '../../../api/userApi';


const DadosCadastraisModal = ({ open, onClose }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        async function carregarUsuario() {
            try {
                const token = localStorage.getItem('token');
                const data = await getMe(token);

                setNome(data.nome || '');
                setEmail(data.email || '');
                setSenha('');
            } catch (error) {
                alert('Erro ao carregar dados do usuário.');
            }
        }

        carregarUsuario();
    }, [open]);

    async function salvarAlteracoes() {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            await updateMe(token, {
                nome,
                email,
                senha,
            });

            alert('Dados atualizados com sucesso!');
            onClose();
        } catch (error) {
            alert('Erro ao atualizar dados.');
        } finally {
            setLoading(false);
        }
    }

    async function excluirConta() {
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir sua conta? Essa ação desativará seu acesso ao sistema.'
        );

        if (!confirmar) return;

        try {
            const token = localStorage.getItem('token');

            await deleteMe(token);

            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            alert('Erro ao excluir conta.');
        }
    }

    return (
        <Modal isOpen={open} onClose={onClose} title="Edição de dados cadastrais">            <div className="space-y-5">
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome
                </label>
                <input
                    type="text"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    E-mail
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Senha
                </label>
                <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="********"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <p className="mt-2 text-xs text-gray-500">
                    Senha protegida por criptografia.
                </p>
            </div>

            <button
                type="button"
                onClick={excluirConta}
                className="text-sm font-medium text-red-600 hover:underline"
            >
                Excluir minha conta
            </button>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>

                <Button onClick={salvarAlteracoes} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </div>
        </Modal>
    );
};

export default DadosCadastraisModal;