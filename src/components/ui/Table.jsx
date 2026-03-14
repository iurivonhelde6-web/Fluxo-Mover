import React from 'react'

/**
 * Table Component
 * 
 * A responsive data table with sticky header, pagination, and custom styling.
 */
const Table = ({
  columns = [],
  data = [],
  emptyMessage = 'Nenhum registro encontrado',
  loading = false,
  onRowClick,
  rowKey = 'id',
}) => {
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row)
    }
    return row[column.key]
  }

  if (loading) {
    return (
      <div className="overflow-hidden border border-stone-200 rounded-lg">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div className="h-4 bg-stone-200 rounded w-24 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((column, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-stone-100 rounded w-full animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="overflow-hidden border border-stone-200 rounded-lg">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="py-12 text-center text-stone-500">
          <p>{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-stone-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider sticky top-0 bg-stone-50"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-100">
            {data.map((row, rowIndex) => (
              <tr
                key={row[rowKey] || rowIndex}
                className={`
                  transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-stone-50' : ''}
                  ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-stone-700"
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

