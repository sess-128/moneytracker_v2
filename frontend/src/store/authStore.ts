import { create } from 'zustand'
import { isTokenExpired } from '@/utils/token'
import type { UserInfoResponse } from '@/types/api.types'

interface AuthState {
  token: string | null
  user: UserInfoResponse | null
  setToken: (token: string) => void
  setUser: (user: UserInfoResponse) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const storedToken = localStorage.getItem('auth_token')
const initialToken = storedToken && !isTokenExpired(storedToken) ? storedToken : null
if (storedToken && !initialToken) localStorage.removeItem('auth_token')

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: initialToken,
  user: null,

  setToken: (token) => {
    localStorage.setItem('auth_token', token)
    set({ token, user: null })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ token: null, user: null })
  },

  isAuthenticated: () => Boolean(get().token),
}))
