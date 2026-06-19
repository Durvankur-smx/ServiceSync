import { Bell, LogOut, Menu, Plus, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const titles = {
  '/dashboard': 'Dashboard',
  '/complaints/new': 'Create Complaint',
}

export default function Navbar({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const pageTitle =
    titles[location.pathname] ||
    (location.pathname.includes('/edit') ? 'Edit Complaint' : 'Complaint Details')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Fixify
            </p>
            <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-xl">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
          <Search size={18} className="text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Search complaints from dashboard</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/complaints/new" className="btn-primary px-3 sm:px-4">
            <Plus size={18} />
            <span className="hidden sm:inline">New</span>
          </Link>
          <button
            type="button"
            className="hidden size-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
