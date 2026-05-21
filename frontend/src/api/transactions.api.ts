import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type {
  TransactionCreateRequest,
  TransactionResponse,
  TransactionUpdateRequest,
  TransactionFilterRequest,
} from '@/types/api.types'

export const transactionsApi = {
  getAll: () =>
    apiClient.get<TransactionResponse[]>(API_ENDPOINTS.transactions.root).then((r) => r.data),

  create: (data: TransactionCreateRequest) =>
    apiClient.post<TransactionResponse>(API_ENDPOINTS.transactions.root, data).then((r) => r.data),

  update: (data: TransactionUpdateRequest) =>
    apiClient.put<TransactionResponse>(API_ENDPOINTS.transactions.root, data).then((r) => r.data),

  getByFilter: (data: TransactionFilterRequest) =>
    apiClient.post<TransactionResponse[]>(API_ENDPOINTS.transactions.byFilter, data).then((r) => r.data),
}
