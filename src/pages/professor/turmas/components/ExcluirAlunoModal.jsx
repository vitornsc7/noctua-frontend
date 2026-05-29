import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '../../../../components/UI';

const ExcluirAlunoModal = ({ isOpen, alunoNome, isDeleting, onClose, onConfirm }) => {
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
                    <Button onClick={onConfirm} disabled={isDeleting} isLoading={isDeleting}>
                        Sim
                    </Button>
                </div>
            }
        >
            <div className="space-y-3 text-sm text-gray-600">
                <p>
                    Tem certeza que deseja remover o aluno <span className="font-medium text-gray-700">{alunoNome}</span> da turma?
                </p>
            </div>
        </Modal>
    );
};

ExcluirAlunoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    alunoNome: PropTypes.string,
    isDeleting: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

ExcluirAlunoModal.defaultProps = {
    alunoNome: '',
    isDeleting: false,
};

export default ExcluirAlunoModal;
