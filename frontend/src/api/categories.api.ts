import { apiClient } from './client'
import type {
  CategoryResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '@/types/api.types'

export const categoriesApi = {
  getAll: () =>
    apiClient.get<CategoryResponse[]>('/api/categories').then((r) => r.data),

  create: (data: CategoryCreateRequest) =>
    apiClient.post<CategoryResponse>('/api/categories', data).then((r) => r.data),

  update: (data: CategoryUpdateRequest) =>
    apiClient.patch<CategoryResponse>('/api/categories', data).then((r) => r.data),
}
