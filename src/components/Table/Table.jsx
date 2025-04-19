import { useState } from 'react'
import './Table.css'

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  actions,
  pagination = true,
  pageSize = 10,
  hideColumns = [] 
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filter visible columns
  const visibleColumns = columns.filter(col => !hideColumns.includes(col.key))
  
  // Handle pagination
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = pagination ? data.slice(startIndex, startIndex + pageSize) : data
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {visibleColumns.map(column => (
              <th key={column.key} style={column.width ? { width: column.width } : {}}>
                {column.label}
              </th>
            ))}
            {actions && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <tr 
                key={row.id || index} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {visibleColumns.map(column => (
                  <td key={`${row.id || index}-${column.key}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="actions-cell">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={visibleColumns.length + (actions ? 1 : 0)} className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {pagination && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button" 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-button" 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Table