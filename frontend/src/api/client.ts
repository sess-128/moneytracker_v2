import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    indexes: null, // отправляет как categoryIds=id1&categoryIds=id2 (без скобок)
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
