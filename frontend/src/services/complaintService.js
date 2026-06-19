import api from '../api/axios.js'

export const complaintService = {
  getComplaints(params = {}) {
    return api.get('/api/complaints', { params })
  },

  getComplaint(id) {
    return api.get(`/api/complaints/${id}`)
  },

  createComplaint(payload) {
    return api.post('/api/complaints', payload)
  },

  updateComplaint(id, payload) {
    return api.put(`/api/complaints/${id}`, payload)
  },

  deleteComplaint(id) {
    return api.delete(`/api/complaints/${id}`)
  },

  countByStatus(status) {
    return api.get('/api/complaints/count', { params: { status } })
  },
}
