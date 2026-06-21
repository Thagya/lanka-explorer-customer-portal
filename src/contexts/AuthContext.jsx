import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('le_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(!!localStorage.getItem('le_token'))

  useEffect(() => {
    const token = localStorage.getItem('le_token')
    if (!token) { setLoading(false); return }
    authApi.getMe()
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem('le_token'); localStorage.removeItem('le_user') })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await authApi.login({ email, password })
    localStorage.setItem('le_token', data.token)
    localStorage.setItem('le_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const { data } = await authApi.register({ name, email, password })
    localStorage.setItem('le_token', data.token)
    localStorage.setItem('le_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('le_token')
    localStorage.removeItem('le_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
