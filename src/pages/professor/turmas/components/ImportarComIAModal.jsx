import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import { Tag } from '../../../../components/UI';

const MAX_SIZE = 20 * 1024 * 1024;
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'application/pdf'];

const ImportarComIAModal = ({ isOpen, onClose, onImport, isLoading }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = useCallback((f) => {
        if (!f) return;
        setSizeError(false);
        setTypeError(false);
        if (!ACCEPT_TYPES.includes(f.type)) {
            setTypeError(true);
            return;
        }
        if (f.size > MAX_SIZE) {
            setSizeError(true);
            return;
        }
        setFile(f);
        if (f.type.startsWith('image/')) {
            const url = URL.createObjectURL(f);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const f = item.getAsFile();
                    if (f) handleFile(f);
                    break;
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [isOpen, handleFile]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setPreview(null);
            setIsDragOver(false);
            setSizeError(false);
            setTypeError(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragOver(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    const handleInputChange = (e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        setSizeError(false);
        setTypeError(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const footer = (
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
            </Button>
            <Button
                variant="primary"
                onClick={() => onImport(file)}
                disabled={!file || isLoading}
                isLoading={isLoading}
                leftIcon={!isLoading ? <i className="pi pi-sparkles text-xs" /> : undefined}
            >
                Importar
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={!isLoading ? onClose : undefined}
            closeOnEsc={!isLoading}
            showCloseButton={!isLoading}
            title={<><i className="pi pi-sparkles mr-1 text-base" />Importar com IA</>}
            footer={footer}
            maxWidth="max-w-md"
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleInputChange}
            />

            {typeError && (
                <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    Tipo de arquivo não suportado. Envie uma imagem (JPEG, PNG, GIF, WebP, BMP) ou PDF.
                </p>
            )}

            {sizeError && (
                <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    O arquivo deve ter no máximo 20MB.
                </p>
            )}

            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors ${isDragOver
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                >
                    <i className={`pi pi-upload text-3xl ${isDragOver ? 'text-primary' : 'text-gray-400'}`} />
                    <div className="text-center mb-1">
                        <p className="font-medium text-gray-600">Arraste uma imagem ou PDF aqui</p>
                        <p className="mt-2 text-sm text-gray-400">
                            ou{' '}
                            <span className="underline">clique para selecionar</span>
                            {' '}do computador
                        </p>
                        <p className="text-sm text-gray-400">
                            ou pressione{' '}
                            <Tag className="px-1 py-[0.5px] text-xs">
                                Ctrl+V
                            </Tag>
                            {' '}para colar da área de transferência
                        </p>
                    </div>
                    <p className="text-xs text-gray-400">Tamanho máximo: 20MB</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    {preview ? (
                        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <i className="pi pi-image text-2xl text-green-500" />
                            <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{file.name}</span>
                        </div>
                    ) : (
                        <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <i className="pi pi-file-pdf text-2xl text-red-500" />
                            <span className="min-w-0 flex-1 truncate text-sm text-gray-600">{file.name}</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="text-sm text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 self-end"
                    >
                        <i className="pi pi-times mr-1 text-xs" />
                        Remover arquivo
                    </button>
                </div>
            )}
        </Modal>
    );
};

ImportarComIAModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default ImportarComIAModal;
