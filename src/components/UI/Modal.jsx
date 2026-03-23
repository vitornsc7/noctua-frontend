import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	className = '',
	maxWidth = 'max-w-lg',
	closeOnEsc = true,
	showCloseButton = true,
	draggable = true,
}) => {
	const panelRef = useRef(null);
	const dragStateRef = useRef({
		isDragging: false,
		pointerId: null,
		startX: 0,
		startY: 0,
		offsetX: 0,
		offsetY: 0,
		rafId: null,
	});

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && closeOnEsc) {
				onClose?.();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, closeOnEsc, onClose]);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		const dragState = dragStateRef.current;

		const scheduleTransformFrame = () => {
			if (dragState.rafId) {
				return;
			}

			dragState.rafId = window.requestAnimationFrame(() => {
				dragState.rafId = null;

				if (!panelRef.current) {
					return;
				}

				panelRef.current.style.transform = `translate3d(${dragState.offsetX}px, ${dragState.offsetY}px, 0)`;
			});
		};

		const handlePointerMove = (event) => {
			if (!dragState.isDragging || event.pointerId !== dragState.pointerId) {
				return;
			}

			dragState.offsetX = event.clientX - dragState.startX;
			dragState.offsetY = event.clientY - dragState.startY;
			scheduleTransformFrame();
		};

		const stopDrag = () => {
			dragState.isDragging = false;
			dragState.pointerId = null;
			document.body.style.userSelect = '';
		};

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', stopDrag);
		window.addEventListener('pointercancel', stopDrag);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', stopDrag);
			window.removeEventListener('pointercancel', stopDrag);

			if (dragState.rafId) {
				window.cancelAnimationFrame(dragState.rafId);
				dragState.rafId = null;
			}
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			dragStateRef.current.offsetX = 0;
			dragStateRef.current.offsetY = 0;

			if (panelRef.current) {
				panelRef.current.style.transform = 'translate3d(0px, 0px, 0)';
			}
		}
	}, [isOpen]);

	const handleHeaderPointerDown = (event) => {
		if (!draggable) {
			return;
		}

		if (event.button !== 0) {
			return;
		}

		const interactiveTarget = event.target.closest('button, input, select, textarea, a');
		if (interactiveTarget) {
			return;
		}

		event.preventDefault();
		dragStateRef.current.isDragging = true;
		dragStateRef.current.pointerId = event.pointerId;
		dragStateRef.current.startX = event.clientX - dragStateRef.current.offsetX;
		dragStateRef.current.startY = event.clientY - dragStateRef.current.offsetY;
		document.body.style.userSelect = 'none';
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`.trim()}
			role="dialog"
			aria-modal="true"
			aria-hidden={!isOpen}
			aria-label={typeof title === 'string' ? title : 'Modal'}
		>
			<div className="absolute inset-0 bg-black/55" />

			<div className={`relative flex w-full justify-center transition-all duration-200 ease-out ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`.trim()}>
				<div ref={panelRef} className={`w-full ${maxWidth}`}>
					<Card
						className={`w-full shadow-2xl ${className}`.trim()}
						header={
							(title || showCloseButton) && (
								<div
									className={`flex items-center justify-between gap-4 ${draggable ? 'cursor-move select-none' : ''}`.trim()}
									onPointerDown={handleHeaderPointerDown}
									style={draggable ? { touchAction: 'none' } : undefined}
								>
									<div className="text-lg font-semibold text-gray-700">{title}</div>

									{showCloseButton && (
										<button
											type="button"
											onClick={onClose}
											className="p-1 text-gray-500 transition-colors hover:text-gray-700"
											aria-label="Fechar modal"
										>
											<i className="pi pi-times text-sm" aria-hidden="true"></i>
										</button>
									)}
								</div>
							)
						}
						footer={footer}
					>
						{children}
					</Card>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	title: PropTypes.node,
	children: PropTypes.node.isRequired,
	footer: PropTypes.node,
	className: PropTypes.string,
	maxWidth: PropTypes.string,
	closeOnEsc: PropTypes.bool,
	showCloseButton: PropTypes.bool,
	draggable: PropTypes.bool,
};

export default Modal;
