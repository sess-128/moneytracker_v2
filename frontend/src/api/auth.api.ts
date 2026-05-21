import { apiClient } from './client'
import type {
  UserLoginRequest,
  UserRegistrationRequest,
  UserTokenResponse,
  UserInfoResponse,
} from '@/types/api.types'

export const authApi = {
  login: (data: UserLoginRequest) =>
    apiClient.post<UserTokenResponse>('/api/v1/users/login', data).then((r) => r.data),

  register: (data: UserRegistrationRequest) =>
    apiClient.post<string>('/api/v1/users/registration', data).then((r) => r.data),

  getMe: () =>
    apiClient.get<UserInfoResponse>('/api/v1/users/me').then((r) => r.data),
}
