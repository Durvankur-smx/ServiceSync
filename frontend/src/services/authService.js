import api from '../api/axios.js'

export const authService = {
  signup(payload) {
    return api.post('/api/auth/signup', payload)
  },

  login(payload) {
    return api.post('/api/auth/login', payload)
  },
}
