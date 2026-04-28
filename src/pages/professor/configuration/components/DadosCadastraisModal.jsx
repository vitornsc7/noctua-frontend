import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, useToast } from '../../../../components/UI';
import { getMe, updateMe, deleteMe } from '../../../../api/userApi';

const DadosCadastraisModal = ({ open, onClose }) => {
    const { showSuccess, showError } = useToast();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmarExclusaoOpen, setConfirmarExclusaoOpen] = useState(false);
    const [excluindoConta, setExcluindoConta] = useState(false);

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
                showError('Erro ao carregar dados do usuário.');
            }
        }

        carregarUsuario();
    }, [open, showError]);

    function validarFormulario() {
        const partesNome = nome.trim().split(/\s+/);

        if (partesNome.length < 2 || partesNome.some((parte) => parte.length < 3)) {
            showError('Informe nome e sobrenome, ambos com pelo menos 3 letras.');
            return false;
        }

        if (senha && (senha.length < 8 || !/\d/.test(senha))) {
            showError('A senha deve ter pelo menos 8 caracteres e conter 1 número.');
            return false;
        }

        return true;
    }

    async function salvarAlteracoes() {
        if (!validarFormulario()) return;

        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            const payload = {
                nome: nome.trim().replace(/\s+/g, ' '),
            };

            if (senha && senha.trim() !== '') {
                payload.senha = senha;
            }

            const usuarioAtualizado = await updateMe(token, payload);

            window.dispatchEvent(
                new CustomEvent('usuarioAtualizado', {
                    detail: usuarioAtualizado,
                })
            );

            showSuccess('Dados atualizados com sucesso!');
            setSenha('');
            onClose();
        } catch (error) {
            showError('Erro ao atualizar dados.');
        } finally {
            setLoading(false);
        }
    }

    async function excluirConta() {
        try {
            setExcluindoConta(true);

            const token = localStorage.getItem('token');

            await deleteMe(token);

            localStorage.removeItem('token');
            showSuccess('Conta excluída com sucesso.');

            window.location.href = '/login';
        } catch (error) {
            showError('Erro ao excluir conta.');
        } finally {
            setExcluindoConta(false);
            setConfirmarExclusaoOpen(false);
        }
    }

    function fecharModalPrincipal() {
        setConfirmarExclusaoOpen(false);
        onClose();
    }

    return (
        <>
            <Modal isOpen={open} onClose={fecharModalPrincipal} title="Edição de dados cadastrais" 
                maxWidth="max-w-md"
                footer={
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => setConfirmarExclusaoOpen(true)}
                            className="text-sm font-medium text-red-600 hover:underline"
                        >
                            Excluir minha conta
                        </button>

                        <div className='flex gap-3'>
                            <Button variant="outline" onClick={fecharModalPrincipal}>
                                Cancelar
                            </Button>

                            <Button onClick={salvarAlteracoes} disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </ div>
                }>
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        label="Nome"
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                    />

                    <div>
                        <Input
                            label="E-mail"
                            type="email"
                            value={email}
                            disabled
                            tabIndex={-1}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            O e-mail não pode ser alterado.
                        </p>
                    </div>

                    <div>
                        <Input
                            label="Senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite uma nova senha"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Preencha apenas se desejar alterar a senha.
                        </p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={confirmarExclusaoOpen}
                onClose={() => setConfirmarExclusaoOpen(false)}
                title="Confirmar exclusão de conta"
            >
                <div className="space-y-5">
                    <p className="text-sm text-gray-600">
                        Tem certeza que deseja excluir sua conta? Essa ação desativará seu
                        acesso ao sistema.
                    </p>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmarExclusaoOpen(false)}
                            disabled={excluindoConta}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={excluirConta}
                            disabled={excluindoConta}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {excluindoConta ? 'Excluindo...' : 'Excluir conta'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DadosCadastraisModal;