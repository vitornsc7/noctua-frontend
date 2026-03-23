import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';
import Pageable from './Pageable';

const getNestedValue = (object, path) => {
    if (!path) {
        return undefined;
    }

    return path
        .split('.')
        .reduce((accumulator, key) => (accumulator == null ? undefined : accumulator[key]), object);
};

const TableColumn = () => null;

const Table = ({
    data = [],
    children,
    rowKey = 'id',
    emptyMessage = 'Nenhum resultado encontrado.',
    loading = false,
    loadingRows = 4,
    actions,
    onView,
    onEdit,
    onDelete,
    actionTooltips,
    actionsHeader = 'Ações',
    pageable,
    className = '',
}) => {
    const columns = React.Children.toArray(children).filter(Boolean);
    const hasBuiltInActions = Boolean(onView || onEdit || onDelete);
    const hasActions = Boolean(actions || hasBuiltInActions);

    const tooltips = {
        view: actionTooltips?.view || 'Exibir',
        edit: actionTooltips?.edit || 'Editar',
        delete: actionTooltips?.delete || 'Excluir',
    };

    const resolveRowKey = (row, index) => {
        if (typeof rowKey === 'function') {
            return rowKey(row, index);
        }

        return row?.[rowKey] ?? index;
    };

    const getCellValue = (row, column) => {
        if (typeof column.props.render === 'function') {
            return column.props.render(row);
        }

        const value = getNestedValue(row, column.props.accessor);
        return value ?? '-';
    };

    const renderBuiltInActions = (row) => (
        <div className="inline-flex items-center justify-end gap-3 whitespace-nowrap text-base">
            {onView && (
                <Tooltip content={tooltips.view}>
                    <i
                        className="pi pi-eye cursor-pointer text-xs text-gray-600"
                        aria-label={`${tooltips.view} item`}
                        onClick={() => onView(row)}
                    ></i>
                </Tooltip>
            )}

            {onEdit && (
                <Tooltip content={tooltips.edit}>
                    <i
                        className="pi pi-pencil cursor-pointer text-xs text-gray-600"
                        aria-label={`${tooltips.edit} item`}
                        onClick={() => onEdit(row)}
                    ></i>
                </Tooltip>
            )}

            {onDelete && (
                <Tooltip content={tooltips.delete}>
                    <i
                        className="pi pi-trash cursor-pointer text-xs text-red-500"
                        aria-label={`${tooltips.delete} item`}
                        onClick={() => onDelete(row)}
                    ></i>
                </Tooltip>
            )}
        </div>
    );

    const shouldRenderPageable = Boolean(pageable && typeof pageable === 'object' && pageable.onPageChange);

    return (
        <div className={`w-full overflow-hidden rounded-lg border border-gray-200 ${className}`.trim()}>
            <div className="overflow-x-auto overflow-y-visible">
                <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.props.id || column.props.accessor || column.props.header}
                                scope="col"
                                className={`px-4 py-3 text-left font-medium text-xs uppercase ${column.props.headerClassName || ''}`.trim()}
                            >
                                {column.props.header}
                            </th>
                        ))}

                        {hasActions && (
                            <th
                                scope="col"
                                className="sticky right-0 z-10 w-px whitespace-nowrap border-l border-gray-200 uppercase bg-gray-100 px-4 py-3 text-center font-medium text-xs"
                            >
                                {actionsHeader}
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {loading && Array.from({ length: loadingRows }).map((_, rowIndex) => (
                        <tr key={`loading-row-${rowIndex}`} className="animate-pulse">
                            {columns.map((column, columnIndex) => (
                                <td
                                    key={`loading-cell-${rowIndex}-${column.props.id || column.props.accessor || columnIndex}`}
                                    className="px-4 py-3 align-middle"
                                >
                                    <div className="h-4 w-full max-w-[180px] rounded bg-gray-200" />
                                </td>
                            ))}

                            {hasActions && (
                                <td className="sticky right-0 w-px whitespace-nowrap border-l border-gray-200 bg-white px-4 py-3 text-right align-middle">
                                    <div className="ml-auto h-4 w-20 rounded bg-gray-200" />
                                </td>
                            )}
                        </tr>
                    ))}

                    {!loading && data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}

                    {!loading && data.map((row, index) => (
                        <tr key={resolveRowKey(row, index)} className="hover:bg-gray-50">
                            {columns.map((column) => (
                                <td
                                    key={`${resolveRowKey(row, index)}-${column.props.id || column.props.accessor || column.props.header}`}
                                    className={`px-4 py-3 align-middle ${column.props.className || ''}`.trim()}
                                >
                                    {getCellValue(row, column)}
                                </td>
                            ))}

                            {hasActions && (
                                <td className="group/actions sticky right-0 z-20 w-px overflow-visible whitespace-nowrap border-l border-gray-200 bg-white px-4 py-3 text-right align-middle hover:z-50">
                                    {actions ? actions(row) : renderBuiltInActions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {shouldRenderPageable && (
                <div className="border-t border-gray-200 px-4 py-3">
                    <Pageable
                        page={pageable.page}
                        pageSize={pageable.pageSize}
                        totalItems={pageable.totalItems}
                        currentItemsCount={pageable.currentItemsCount}
                        onPageChange={pageable.onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    emptyMessage: PropTypes.string,
    loading: PropTypes.bool,
    loadingRows: PropTypes.number,
    actions: PropTypes.func,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    actionTooltips: PropTypes.shape({
        view: PropTypes.string,
        edit: PropTypes.string,
        delete: PropTypes.string,
    }),
    actionsHeader: PropTypes.node,
    pageable: PropTypes.shape({
        page: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalItems: PropTypes.number.isRequired,
        currentItemsCount: PropTypes.number,
        onPageChange: PropTypes.func.isRequired,
    }),
    className: PropTypes.string,
};

TableColumn.propTypes = {
    id: PropTypes.string,
    header: PropTypes.node.isRequired,
    accessor: PropTypes.string,
    render: PropTypes.func,
    className: PropTypes.string,
    headerClassName: PropTypes.string,
};

Table.Column = TableColumn;

export default Table;
