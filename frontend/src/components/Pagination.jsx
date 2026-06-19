import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange, disabled }) {
  if (!totalPages || totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:px-5">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{page + 1}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-secondary px-3"
          disabled={disabled || page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          type="button"
          className="btn-secondary px-3"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
