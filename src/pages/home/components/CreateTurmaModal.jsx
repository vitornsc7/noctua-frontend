import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, useToast } from '../../../components/UI';

const HomeCreateTurmaModal = ({ isOpen, onClose }) => {
    const { showSuccess } = useToast();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Criar nova turma"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            showSuccess('Turma criada!', 'A turma foi criada com sucesso.');
                            onClose?.();
                        }}
                    >
                        Salvar
                    </Button>
                </div>
            }
        >
            <div className="space-y-3">
                <p className="text-gray-700 text-sm">Arraste pelo cabecalho para mover.</p>
                <Input label="Nome da turma" placeholder="Ex: Matematica 2026" />
            </div>
        </Modal>
    );
};

HomeCreateTurmaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default HomeCreateTurmaModal;
