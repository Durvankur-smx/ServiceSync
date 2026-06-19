/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fixify_token'))
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type })
    window.clearTimeout(window.fixifyToastTimer)
    window.fixifyToastTimer = window.setTimeout(() => setToast(null), 3500)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials)
    localStorage.setItem('fixify_token', data.token)
    setToken(data.token)
    return data
  }, [])

  const signup = useCallback(async (payload) => {
    const { data } = await authService.signup(payload)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fixify_token')
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      notify,
      signup,
      toast,
      token,
    }),
    [login, logout, notify, signup, toast, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
