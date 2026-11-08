import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getTokenExpiry, isTokenExpired } from '@/utils/token'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) return
    let timer: ReturnType<typeof setTimeout>
    const checkExpiry = () => {
      clearTimeout(timer)
      const expiry = getTokenExpiry(token)
      if (expiry === null) return
      const remaining = expiry - Date.now()
      if (remaining <= 0) logout()
      else timer = setTimeout(checkExpiry, Math.min(remaining, 2_147_483_647))
    }
    checkExpiry()
    window.addEventListener('focus', checkExpiry)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', checkExpiry)
    }
  }, [token, logout])

  useEffect(() => useAuthStore.subscribe((state, previous) => {
    if (state.token !== previous.token) {
      void queryClient.cancelQueries()
      queryClient.clear()
    }
  }), [queryClient])

  const isAuthenticated = token && !isTokenExpired(token)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
