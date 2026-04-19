import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ActionMenu = ({
    buttonLabel = 'Mais ações',
    buttonClassName = '',
    menuClassName = '',
    children,
}) => {
    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const closeMenu = () => {
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen((current) => !current);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={toggleMenu}
                className={[
                    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-700',
                    buttonClassName,
                ].join(' ').trim()}
                aria-label={buttonLabel}
            >
                <i className="pi pi-ellipsis-h text-sm" aria-hidden="true"></i>
            </button>

            {isOpen && (
                <div
                    className={[
                        'absolute right-0 top-11 z-20 min-w-[250px] origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white animate-[actionMenuIn_160ms_ease-out] motion-reduce:animate-none',
                        menuClassName,
                    ].join(' ').trim()}
                >
                    {typeof children === 'function' ? children({ closeMenu }) : children}
                </div>
            )}

            <style>
                {`@keyframes actionMenuIn {
                    from {
                        opacity: 0;
                        transform: translateY(-6px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }`}
            </style>
        </div>
    );
};

ActionMenu.propTypes = {
    buttonLabel: PropTypes.string,
    buttonClassName: PropTypes.string,
    menuClassName: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default ActionMenu;