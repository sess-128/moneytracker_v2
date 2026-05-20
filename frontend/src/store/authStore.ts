import { create } from 'zustand'
import type { UserInfoResponse } from '@/types/api.types'

interface AuthState {
  token: string | null
  user: UserInfoResponse | null
  setToken: (token: string) => void
  setUser: (user: UserInfoResponse) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: localStorage.getItem('auth_token'),
  user: null,

  setToken: (token) => {
    localStorage.setItem('auth_token', token)
    set({ token })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ token: null, user: null })
  },

  isAuthenticated: () => Boolean(get().token),
}))
