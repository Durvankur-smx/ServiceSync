import { Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { complaintService } from '../services/complaintService.js'

const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function getErrorMessage(error) {
  if (error.response?.status === 400) return error.response?.data?.message || 'Please check the form fields'
  if (error.response?.status >= 500) return 'Server error. Please try again.'
  return error.response?.data?.message || 'Unable to create complaint'
}

export default function CreateComplaint() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { notify } = useAuth()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      description: '',
      priority: 'MEDIUM',
      status: 'OPEN',
      title: '',
    },
  })

  const onSubmit = async (values) => {
    setServerError('')

    try {
      await complaintService.createComplaint(values)
      notify('Complaint created successfully')
      navigate('/dashboard')
    } catch (error) {
      setServerError(getErrorMessage(error))
      notify(getErrorMessage(error), 'error')
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="panel p-5 sm:p-7">
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-xl font-semibold text-slate-950">Create Complaint</h2>
          <p className="mt-1 text-sm text-slate-500">Log a service issue with status and priority.</p>
        </div>

        {serverError && (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="form-input mt-2"
              placeholder="Short complaint title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows="6"
              className="form-input mt-2 resize-y"
              placeholder="Describe the issue, location, impact, and useful context"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select id="status" className="form-input mt-2" {...register('status')}>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="priority">
                Priority
              </label>
              <select id="priority" className="form-input mt-2" {...register('priority')}>
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Save size={18} />
              {isSubmitting ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
