import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import type { UserLoginRequest, UserRegistrationRequest } from '@/types/api.types'

export const useLogin = () => {
  const { setToken } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: UserLoginRequest) => authApi.login(data),
    onSuccess: ({ token }) => {
      setToken(token)
      navigate('/', { replace: true })
    },
  })
}

export const useRegister = () => {
  const { setToken } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: UserRegistrationRequest) => {
      await authApi.register(data)
      const { token } = await authApi.login({ username: data.username, password: data.password })
      return token
    },
    onSuccess: (token) => {
      setToken(token)
      navigate('/', { replace: true })
    },
  })
}

export const useCurrentUser = () => {
  const token = useAuthStore((s) => s.token)
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const user = await authApi.getMe()
      setUser(user)
      return user
    },
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  })
}
