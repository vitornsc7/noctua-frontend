import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Tooltip = ({ content, children, className = '', contentClassName = '' }) => {
    const triggerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = () => {
        if (!triggerRef.current) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + 8,
            left: rect.left + (rect.width / 2),
        });
    };

    const handleShow = () => {
        updatePosition();
        setIsVisible(true);
    };

    const handleHide = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (!isVisible) {
            return undefined;
        }

        const handleWindowChange = () => {
            updatePosition();
        };

        window.addEventListener('resize', handleWindowChange);
        window.addEventListener('scroll', handleWindowChange, true);

        return () => {
            window.removeEventListener('resize', handleWindowChange);
            window.removeEventListener('scroll', handleWindowChange, true);
        };
    }, [isVisible]);

    if (!content) {
        return children;
    }

    return (
        <span
            ref={triggerRef}
            className={`inline-flex ${className}`.trim()}
            onMouseEnter={handleShow}
            onMouseLeave={handleHide}
            onFocus={handleShow}
            onBlur={handleHide}
        >
            {children}

            {isVisible && typeof document !== 'undefined' && createPortal(
                <span
                    role="tooltip"
                    className={`pointer-events-none fixed z-[1000] w-max max-w-[200px] text-justify -translate-x-1/2 rounded-md bg-gray-700 px-2 py-1 text-sm text-white ${contentClassName}`.trim()}
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                >
                    <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full 
                                w-0 h-0 
                                border-l-[6px] border-l-transparent 
                                border-r-[6px] border-r-transparent 
                                border-b-[6px] border-b-gray-700"
                    />
                    {content}
                </span>,
                document.body,
            )}
        </span>
    );
};

Tooltip.propTypes = {
    content: PropTypes.node,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
};

export default Tooltip;
