import { memo } from 'react';

const ROWS_OPTIONS = [5, 10, 25, 50];

interface PaginationProps {
  rowsPerPage: number;
  totalRows: number;
  page: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
}

function Pagination({
  rowsPerPage,
  totalRows,
  page,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const options = [...new Set([...ROWS_OPTIONS, rowsPerPage])].sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-between gap-4 py-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <span>Rows per page:</span>
        {onRowsPerPageChange ? (
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="rounded border border-neutral-300 bg-white px-2 py-1 text-neutral-800 font-medium"
            aria-label="Rows per page"
          >
            {options.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        ) : (
          <span className="font-medium">{rowsPerPage}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          className="p-2 rounded hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none text-neutral-600"
          aria-label="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="p-2 rounded hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none text-neutral-600"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="px-2 text-sm text-neutral-700">Page {page} of {totalPages}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="p-2 rounded hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none text-neutral-600"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          className="p-2 rounded hover:bg-neutral-200 disabled:opacity-50 disabled:pointer-events-none text-neutral-600"
          aria-label="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

export default memo(Pagination);
