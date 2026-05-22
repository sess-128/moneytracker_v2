import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type {
  UserLoginRequest,
  UserRegistrationRequest,
  UserTokenResponse,
  UserInfoResponse,
} from '@/types/api.types'

export const authApi = {
  login: (data: UserLoginRequest) =>
    apiClient.post<UserTokenResponse>(API_ENDPOINTS.auth.login, data).then((r) => r.data),

  register: (data: UserRegistrationRequest) =>
    apiClient.post<string>(API_ENDPOINTS.auth.register, data).then((r) => r.data),

  getMe: () =>
    apiClient.get<UserInfoResponse>(API_ENDPOINTS.auth.me).then((r) => r.data),
}
