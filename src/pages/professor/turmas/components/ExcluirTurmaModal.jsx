import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '../../../../components/UI';

const ExcluirTurmaModal = ({ isOpen, turmaNome, isDeleting, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                if (!isDeleting) {
                    onClose();
                }
            }}
            title="Confirmar exclusão"
            maxWidth="max-w-md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Não
                    </Button>
                    <Button onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Sim'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-3 text-sm text-gray-600">
                <p>
                    Tem certeza que deseja excluir a turma <span className="font-medium text-gray-700">{turmaNome}</span>?
                </p>
                <p>Essa ação remove a turma da listagem principal e não poderá ser desfeita pela interface.</p>
            </div>
        </Modal>
    );
};

ExcluirTurmaModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    turmaNome: PropTypes.string,
    isDeleting: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

ExcluirTurmaModal.defaultProps = {
    turmaNome: '',
    isDeleting: false,
};

export default ExcluirTurmaModal;