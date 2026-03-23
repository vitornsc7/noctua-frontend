import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Pageable = ({
    page,
    pageSize,
    totalItems,
    currentItemsCount,
    onPageChange,
    className = '',
}) => {
    const safeTotal = Math.max(0, totalItems);
    const hasItems = safeTotal > 0;

    const start = hasItems ? (page * pageSize) + 1 : 0;

    const visibleCount = typeof currentItemsCount === 'number'
        ? currentItemsCount
        : Math.min(pageSize, Math.max(safeTotal - (page * pageSize), 0));

    const end = hasItems ? Math.min(start + visibleCount - 1, safeTotal) : 0;

    const canGoBack = page > 0;
    const canGoNext = end < safeTotal;

    return (
        <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}>
            <p className="text-sm text-gray-600">
                Mostrando {start}-{end} de{' '}
                {safeTotal} resultados
            </p>

            <div className="inline-flex items-center gap-2">
                <Button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canGoBack}
                    className="inline-flex h-7 w-7 items-center justify-center"
                    aria-label="Página anterior"
                >
                    <i className="pi pi-chevron-left text-xs" aria-hidden="true"></i>
                </Button>

                <span className="inline-flex h-7 min-w-7 items-center justify-center text-sm font-medium text-gray-700">
                    {page + 1}
                </span>

                <Button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canGoNext}
                    className="inline-flex h-7 w-7 items-center justify-center"
                    aria-label="Próxima página"
                >
                    <i className="pi pi-chevron-right text-xs" aria-hidden="true"></i>
                </Button>
            </div>
        </div>
    );
};

Pageable.propTypes = {
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    currentItemsCount: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default Pageable;
