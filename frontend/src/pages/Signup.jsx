import { LockKeyhole, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || 'Unable to create account'
}

export default function Signup() {
  const [serverError, setServerError] = useState('')
  const { isAuthenticated, notify, signup } = useAuth()
  const navigate = useNavigate()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (values) => {
    setServerError('')

    try {
      await signup(values)
      notify('Account created. Please login.')
      navigate('/login', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto inline-flex size-12 items-center justify-center rounded-lg bg-brand-600 text-white">
            <User size={23} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Create your Fixify account</h1>
          <p className="mt-2 text-sm text-slate-500">Start managing service requests in one workspace.</p>
        </div>

        <div className="panel p-6 sm:p-8">
          {serverError && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  id="name"
                  className="form-input pl-10"
                  placeholder="Your name"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

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
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Signup'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link className="font-semibold text-brand-600 hover:text-brand-700" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
