import { LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || 'Unable to login'
}

export default function Login() {
  const [serverError, setServerError] = useState('')
  const { isAuthenticated, login, notify } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values) => {
    setServerError('')

    try {
      await login(values)
      notify('Logged in successfully')
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_560px]">
      <section className="hidden bg-brand-700 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex size-12 items-center justify-center rounded-lg bg-white/15">
            <LockKeyhole size={24} />
          </div>
          <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight">Fixify</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">
            Manage service complaints, track priorities, and keep resolution work clear.
          </p>
        </div>
        <p className="text-sm text-blue-100">Service & Complaint Management System</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-600 text-white">
              <LockKeyhole size={22} />
            </div>
            <h1 className="mt-5 text-3xl font-bold text-slate-950">Fixify</h1>
          </div>

          <div className="panel p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to continue to your dashboard.</p>
            </div>

            {serverError && (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    id="email"
                    type="email"
                    className="form-input pl-10"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    id="password"
                    type="password"
                    className="form-input pl-10"
                    placeholder="Enter your password"
                    {...register('password', { required: 'Password is required' })}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              No account?{' '}
              <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/signup">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
