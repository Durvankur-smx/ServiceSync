import { AlertCircle, CheckCircle2, Clock3, ListChecks, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ComplaintCard from '../components/ComplaintCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { complaintService } from '../services/complaintService.js'

const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function getErrorMessage(error) {
  if (error.response?.status === 400) return error.response?.data?.message || 'Invalid request'
  if (error.response?.status >= 500) return 'Server error. Please try again.'
  return error.response?.data?.message || 'Something went wrong'
}

function getCountValue(data) {
  return data?.count ?? data?.total ?? data?.value ?? 0
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [counts, setCounts] = useState({ OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setDeleting] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [priority, setPriority] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { notify } = useAuth()

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return complaints

    return complaints.filter((complaint) =>
      [complaint.title, complaint.description, complaint.status, complaint.priority]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [complaints, search])

  const stats = [
    { label: 'Total Complaints', value: totalElements, icon: ListChecks, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Open Complaints', value: counts.OPEN, icon: AlertCircle, tone: 'bg-sky-50 text-sky-700' },
    { label: 'In Progress', value: counts.IN_PROGRESS, icon: Clock3, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Resolved', value: counts.RESOLVED, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-700' },
  ]

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true)

      try {
        const { data } = await complaintService.getComplaints({
          page,
          size: 5,
          sortBy: 'id',
          ...(status ? { status } : {}),
          ...(priority ? { priority } : {}),
        })

        setComplaints(data.content || [])
        setTotalElements(data.totalElements || 0)
        setTotalPages(data.totalPages || 0)
      } catch (error) {
        notify(getErrorMessage(error), 'error')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [notify, page, priority, status])

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const responses = await Promise.all(
          ['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((item) => complaintService.countByStatus(item)),
        )
        setCounts({
          OPEN: getCountValue(responses[0].data),
          IN_PROGRESS: getCountValue(responses[1].data),
          RESOLVED: getCountValue(responses[2].data),
        })
      } catch {
        setCounts({ OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 })
      }
    }

    loadCounts()
  }, [])

  const resetFilters = () => {
    setSearch('')
    setStatus('')
    setPriority('')
    setPage(0)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)

    try {
      await complaintService.deleteComplaint(deleteTarget.id)
      notify('Complaint deleted successfully')
      setDeleteTarget(null)
      setComplaints((items) => items.filter((item) => item.id !== deleteTarget.id))
      setTotalElements((value) => Math.max(value - 1, 0))
    } catch (error) {
      notify(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.label} className="panel p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
                </div>
                <div className={`flex size-11 items-center justify-center rounded-md ${stat.tone}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Complaint List</h2>
              <p className="mt-1 text-sm text-slate-500">Track, filter, and manage service complaints.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[260px_170px_170px_auto]">
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="form-input pl-10"
                  placeholder="Search current page"
                />
              </div>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value)
                  setPage(0)
                }}
                className="form-input"
              >
                <option value="">All status</option>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
              <select
                value={priority}
                onChange={(event) => {
                  setPriority(event.target.value)
                  setPage(0)
                }}
                className="form-input"
              >
                <option value="">All priority</option>
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-secondary" onClick={resetFilters}>
                <X size={17} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading complaints...</div>
          ) : filteredComplaints.length ? (
            filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} onDelete={setDeleteTarget} />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 py-12 text-center">
              <p className="font-semibold text-slate-900">No complaints found</p>
              <p className="mt-1 text-sm text-slate-500">Try changing filters or create a new complaint.</p>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          disabled={isLoading}
          onPageChange={setPage}
        />
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-950">Delete complaint?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will permanently delete "{deleteTarget.title}". This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
