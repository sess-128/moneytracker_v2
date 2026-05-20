import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface PublicRouteProps {
  children: ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
