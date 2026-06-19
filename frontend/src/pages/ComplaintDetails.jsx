import { ArrowLeft, Calendar, Pencil, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { complaintService } from '../services/complaintService.js'

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
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function label(value) {
  return value ? value.replaceAll('_', ' ') : 'Unassigned'
}

function getErrorMessage(error) {
  if (error.response?.status === 400) return error.response?.data?.message || 'Invalid request'
  if (error.response?.status >= 500) return 'Server error. Please try again.'
  return error.response?.data?.message || 'Unable to load complaint'
}

export default function ComplaintDetails() {
  const [complaint, setComplaint] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const { notify } = useAuth()

  useEffect(() => {
    const loadComplaint = async () => {
      setLoading(true)

      try {
        const { data } = await complaintService.getComplaint(id)
        setComplaint(data)
      } catch (error) {
        notify(getErrorMessage(error), 'error')
      } finally {
        setLoading(false)
      }
    }

    loadComplaint()
  }, [id, notify])

  if (isLoading) {
    return <div className="panel p-8 text-center text-sm text-slate-500">Loading complaint...</div>
  }

  if (!complaint) {
    return (
      <div className="panel p-8 text-center">
        <p className="font-semibold text-slate-950">Complaint not found</p>
        <button type="button" className="btn-secondary mt-4" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <Link to={`/complaints/${complaint.id}/edit`} className="btn-primary">
          <Pencil size={18} />
          Edit Complaint
        </Link>
      </div>

      <article className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-950">{complaint.title}</h2>
              <p className="mt-2 text-sm text-slate-500">Complaint #{complaint.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  statusStyles[complaint.status] || statusStyles.OPEN
                }`}
              >
                {label(complaint.status)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  priorityStyles[complaint.priority] || priorityStyles.MEDIUM
                }`}
              >
                {label(complaint.priority)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_280px]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {complaint.description}
            </p>
          </div>

          <aside className="space-y-4 rounded-lg bg-slate-50 p-4">
            <div className="flex gap-3">
              <Calendar className="mt-0.5 text-slate-400" size={18} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</p>
                <p className="mt-1 text-sm text-slate-900">{formatDate(complaint.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Calendar className="mt-0.5 text-slate-400" size={18} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</p>
                <p className="mt-1 text-sm text-slate-900">{formatDate(complaint.updatedAt)}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <User className="mt-0.5 text-slate-400" size={18} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created By</p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {complaint.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-sm text-slate-500">{complaint.createdBy?.email || 'No email'}</p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </section>
  )
}
