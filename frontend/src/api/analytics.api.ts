import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type {
  AnalyticsFilterRequest,
  AnalyticsFilterResponse,
  AnalyticsPeriodRequest,
  AnalyticsSummaryResponse,
  AnalyticsTypedSummaryRequest,
  AnalyticsTypedSummaryResponse,
} from '@/types/api.types'

export const analyticsApi = {
  getByFilter: (params: AnalyticsFilterRequest) =>
    apiClient.get<AnalyticsFilterResponse[]>(API_ENDPOINTS.analytics.byFilter, { params })
      .then(r => r.data),

  getSummary: (params: AnalyticsPeriodRequest) =>
    apiClient.get<AnalyticsSummaryResponse>(API_ENDPOINTS.analytics.summary, { params })
      .then(r => r.data),

  getTypedSummary: (params: AnalyticsTypedSummaryRequest) =>
    apiClient.get<AnalyticsTypedSummaryResponse>(API_ENDPOINTS.analytics.summaryByType, { params })
      .then(r => r.data),
}
