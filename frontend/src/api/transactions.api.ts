import { apiClient } from './client'
import type {
  TransactionRequest,
  TransactionResponse,
  TransactionUpdateRequest,
  TransactionFilterRequest,
} from '@/types/api.types'

export const transactionsApi = {
  getAll: () =>
    apiClient.get<TransactionResponse[]>('/api/v1/transactions').then((r) => r.data),

  create: (data: TransactionRequest) =>
    apiClient.post<TransactionResponse>('/api/v1/transactions', data).then((r) => r.data),

  update: (data: TransactionUpdateRequest) =>
    apiClient.put<TransactionResponse>('/api/v1/transactions', data).then((r) => r.data),

  getByFilter: (data: TransactionFilterRequest) =>
    apiClient.post<TransactionResponse[]>('/api/v1/transactions/by-filter', data).then((r) => r.data),
}
