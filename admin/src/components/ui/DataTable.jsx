import React from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export function DataTable({
  columns,
  data = [],
  loading = false,
  search = '',
  onSearchChange,
  filterValue,
  filterOptions = [],
  onFilterChange,
  page = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  createAction,
  title,
  subtitle,
}) {
  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          {title && <h2 className="card-title">{title}</h2>}
          {subtitle && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {onSearchChange && (
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)',
                }}
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px', paddingRight: '10px', fontSize: '13px' }}
                placeholder="Search records..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}

          {filterOptions.length > 0 && onFilterChange && (
            <select
              className="form-control"
              style={{ width: 'auto', fontSize: '13px' }}
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {createAction}
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Inbox size={36} color="var(--text-subtle)" />
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>No records found</span>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Try adjusting filters or create a new entry.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row._id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : row[col.accessor] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-muted)',
            background: '#FAFAFA',
          }}
        >
          <span>
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalItems} records)
          </span>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
