import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const AuditPagination: React.FC<AuditPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-secondary shadow-sm">
      {/* Items count & Per-page selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-text-primary">{startIdx}</strong>–<strong className="text-text-primary">{endIdx}</strong> of{' '}
          <strong className="text-text-primary">{totalItems}</strong> audit logs
        </span>

        <div className="flex items-center gap-1.5 pl-2 border-l border-subtle">
          <span className="text-text-muted">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-surface-2 border border-subtle rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-subtle disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg font-bold transition-all ${
              currentPage === p
                ? 'bg-primary text-text-primary shadow-glow-primary/40'
                : 'bg-surface-2 hover:bg-surface-3 border border-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-subtle disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary hover:text-text-primary transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
