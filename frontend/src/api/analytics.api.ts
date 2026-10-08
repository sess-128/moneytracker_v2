import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { AnalyticsFilterRequest, AnalyticsFilterResponse } from '@/types/api.types'

export const analyticsApi = {
  getByFilter: (params: AnalyticsFilterRequest) =>
    apiClient.get<AnalyticsFilterResponse[]>(API_ENDPOINTS.analytics.byFilter, { params })
      .then(r => r.data),
}
