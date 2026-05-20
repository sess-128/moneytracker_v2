import { apiClient } from './client'
import type {
  UserLoginRequest,
  UserRegistrationRequest,
  UserTokenResponse,
  UserInfoResponse,
} from '@/types/api.types'

export const authApi = {
  login: (data: UserLoginRequest) =>
    apiClient.post<UserTokenResponse>('/api/users/login', data).then((r) => r.data),

  register: (data: UserRegistrationRequest) =>
    apiClient.post<string>('/api/users/registration', data).then((r) => r.data),

  getMe: () =>
    apiClient.get<UserInfoResponse>('/api/users/me').then((r) => r.data),
}
