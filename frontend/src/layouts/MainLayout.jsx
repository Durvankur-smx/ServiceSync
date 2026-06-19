import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-soft ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
