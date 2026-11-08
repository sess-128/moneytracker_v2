import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import { isTokenExpired } from '@/utils/token'
import { API_ENDPOINTS } from './endpoints'

export const apiClient = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    indexes: null, // отправляет как categoryIds=id1&categoryIds=id2 (без скобок)
  },
})

apiClient.interceptors.request.use((config) => {
  const isPublic = config.url === API_ENDPOINTS.auth.login || config.url === API_ENDPOINTS.auth.register
  if (isPublic) return config
  const token = useAuthStore.getState().token
  if (token && isTokenExpired(token)) {
    useAuthStore.getState().logout()
    return Promise.reject(new axios.CanceledError('Срок сессии истёк'))
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = useAuthStore.getState().token
    // Ignore public login errors and responses belonging to a previous session.
    if (error.response?.status === 401 && token &&
        error.config?.headers?.Authorization === `Bearer ${token}`) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
