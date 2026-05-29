import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Modal, useToast } from '../../../../components/UI';
import { getMe, updateMe, deleteMe } from '../../../../api/userApi';
import { editUserSchema, EDIT_USER_INITIAL_VALUES } from '../../../authentication/authSchema';

const DadosCadastraisModal = ({ open, onClose }) => {
    const { showSuccess, showError } = useToast();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmarExclusaoOpen, setConfirmarExclusaoOpen] = useState(false);
    const [excluindoConta, setExcluindoConta] = useState(false);

    const {
        watch,
        setValue,
        trigger,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: EDIT_USER_INITIAL_VALUES,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const dadosUsuario = watch();

    useEffect(() => {
        if (!open) return;

        async function carregarUsuario() {
            try {
                const token = localStorage.getItem('token');
                const data = await getMe(token);

                reset({
                    nome: data.nome || '',
                    senha: '',
                });

                setEmail(data.email || '');
            } catch (error) {
                showError('Erro ao carregar dados do usuário', 'Tente novamente mais tarde.');
            }
        }

        carregarUsuario();
    }, [open, reset, showError]);

    const handleFieldChange = (field) => (event) => {
        setValue(field, event.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: Boolean(errors[field]),
        });
    };

    const handleFieldBlur = (field) => () => {
        trigger(field);
    };

    const getFieldProps = (field) => ({
        value: dadosUsuario[field] ?? '',
        onChange: handleFieldChange(field),
        onBlur: handleFieldBlur(field),
        error: errors[field]?.message,
    });

    async function salvarAlteracoes(data) {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            const payload = {
                nome: data.nome.trim().replace(/\s+/g, ' '),
            };

            if (data.senha && data.senha.trim() !== '') {
                payload.senha = data.senha;
            }

            const usuarioAtualizado = await updateMe(token, payload);

            window.dispatchEvent(
                new CustomEvent('usuarioAtualizado', {
                    detail: usuarioAtualizado,
                })
            );

            showSuccess('Dados atualizados com sucesso!', 'Suas informações foram salvas.');

            reset({
                nome: usuarioAtualizado.nome || payload.nome,
                senha: '',
            });

            onClose();
        } catch (error) {
            showError('Erro ao atualizar dados', 'Tente novamente mais tarde.');
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
            showSuccess('Conta excluída com sucesso.', 'Você será redirecionado para o login.');

            window.location.href = '/login';
        } catch (error) {
            showError('Erro ao excluir conta', 'Tente novamente mais tarde.');
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
            <Modal
                isOpen={open}
                onClose={fecharModalPrincipal}
                title="Edição de dados cadastrais"
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

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={fecharModalPrincipal}>
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                form="dados-cadastrais-form"
                                disabled={loading}
                                isLoading={loading}
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                }
            >
                <form
                    id="dados-cadastrais-form"
                    onSubmit={handleSubmit(salvarAlteracoes)}
                    className="grid grid-cols-1 gap-4"
                >
                    <Input
                        label="Nome"
                        type="text"
                        required
                        {...getFieldProps('nome')}
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        value={email}
                        disabled
                        tabIndex={-1}
                        tooltip="O e-mail não pode ser alterado."
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="Digite uma nova senha"
                        {...getFieldProps('senha')}
                    />
                </form>
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
                            isLoading={excluindoConta}
                        >
                            Excluir conta
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DadosCadastraisModal;