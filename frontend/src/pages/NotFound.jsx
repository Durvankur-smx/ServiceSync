import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="panel max-w-md p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or has moved.
        </p>
        <Link to="/dashboard" className="btn-primary mt-6">
          <Home size={18} />
          Dashboard
        </Link>
      </div>
    </main>
  )
}
