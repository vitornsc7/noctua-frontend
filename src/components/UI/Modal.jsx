import React, { useEffect, useRef, useState } from 'react';
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
	const [visible, setVisible] = useState(false);
	const closeTimerRef = useRef(null);
	const dragStateRef = useRef({
		isDragging: false,
		pointerId: null,
		startX: 0,
		startY: 0,
		offsetX: 0,
		offsetY: 0,
		rafId: null,
	});

	const handleClose = () => {
		setVisible(false);
		closeTimerRef.current = setTimeout(() => {
			onClose?.();
		}, 200);
	};

	useEffect(() => {
		return () => {
			if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
		};
	}, []);

	useEffect(() => {
		if (!isOpen) {
			setVisible(false);
			return undefined;
		}

		const raf = requestAnimationFrame(() => setVisible(true));

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && closeOnEsc) {
				handleClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			cancelAnimationFrame(raf);
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, closeOnEsc]);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		const panel = panelRef.current;
		if (!panel) {
			return undefined;
		}

		const FOCUSABLE = [
			'a[href]',
			'button:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[tabindex]:not([tabindex="-1"])',
		].join(', ');

		const previouslyFocused = document.activeElement;

		const getFocusable = () => Array.from(panel.querySelectorAll(FOCUSABLE));

		const focusable = getFocusable();
		const firstContent = focusable.find((el) => !el.hasAttribute('data-modal-close-btn')) ?? focusable[0];
		if (firstContent) {
			firstContent.focus();
		}

		const handleTabTrap = (event) => {
			if (event.key !== 'Tab') {
				return;
			}

			const els = getFocusable();
			if (els.length === 0) {
				event.preventDefault();
				return;
			}

			const first = els[0];
			const last = els[els.length - 1];

			if (event.shiftKey) {
				if (document.activeElement === first) {
					event.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener('keydown', handleTabTrap);

		return () => {
			document.removeEventListener('keydown', handleTabTrap);
			previouslyFocused?.focus?.();
		};
	}, [isOpen]);

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
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`.trim()}
			role="dialog"
			aria-modal="true"
			aria-hidden={!isOpen}
			aria-label={typeof title === 'string' ? title : 'Modal'}
		>
			<div className="absolute inset-0 bg-black/55" />

			<div className={`relative flex w-full justify-center transition-all duration-200 ease-out ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`.trim()}>
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
									<div className="text-lg font-medium text-gray-700">{title}</div>

									{showCloseButton && (
										<button
											type="button"
											onClick={handleClose}
											className="
												w-8 h-8
												flex items-center justify-center
												rounded-full
												text-gray-700
												hover:bg-gray-100
												hover:text-gray-700
												transition-colors
												outline-none 0 focus:ring-2 focus:ring-gray-300
											"
											aria-label="Fechar modal"
											data-modal-close-btn
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
