import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('le_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let redirecting = false
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('le_token')
      localStorage.removeItem('le_token')
      localStorage.removeItem('le_user')
      if (hadToken && !redirecting) {
        redirecting = true
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
