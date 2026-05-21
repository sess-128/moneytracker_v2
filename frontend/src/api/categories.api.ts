import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type {
  CategoryResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '@/types/api.types'

export const categoriesApi = {
  getAll: () =>
    apiClient.get<CategoryResponse[]>(API_ENDPOINTS.categories.root).then((r) => r.data),

  create: (data: CategoryCreateRequest) =>
    apiClient.post<CategoryResponse>(API_ENDPOINTS.categories.root, data).then((r) => r.data),

  update: (data: CategoryUpdateRequest) =>
    apiClient.patch<CategoryResponse>(API_ENDPOINTS.categories.root, data).then((r) => r.data),
}
