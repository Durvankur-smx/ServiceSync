import { Calendar, Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusStyles = {
  OPEN: 'bg-blue-50 text-blue-700 ring-blue-100',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-100',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  CLOSED: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-indigo-50 text-indigo-700',
  HIGH: 'bg-orange-50 text-orange-700',
  CRITICAL: 'bg-red-50 text-red-700',
}

function formatDate(value) {
  if (!value) return 'Not available'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function label(value) {
  return value ? value.replaceAll('_', ' ') : 'Unassigned'
}

export default function ComplaintCard({ complaint, onDelete }) {
  return (
    <article className="panel overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-950">
              {complaint.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {complaint.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                statusStyles[complaint.status] || statusStyles.OPEN
              }`}
            >
              {label(complaint.status)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                priorityStyles[complaint.priority] || priorityStyles.MEDIUM
              }`}
            >
              {label(complaint.priority)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={16} />
            {formatDate(complaint.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/complaints/${complaint.id}`}
              className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label={`View ${complaint.title}`}
              title="View"
            >
              <Eye size={17} />
            </Link>
            <Link
              to={`/complaints/${complaint.id}/edit`}
              className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label={`Edit ${complaint.title}`}
              title="Edit"
            >
              <Pencil size={17} />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(complaint)}
              className="inline-flex size-9 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
              aria-label={`Delete ${complaint.title}`}
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
