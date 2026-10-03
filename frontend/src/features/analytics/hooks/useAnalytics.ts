import { useQuery, useQueryClient } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics.api'
import type { AnalyticsFilterRequest } from '@/types/api.types'

export const ANALYTICS_QUERY_KEY = ['analytics'] as const

export const useAnalytics = (params: AnalyticsFilterRequest | null) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, params?.startDate, params?.endDate, ...params?.categoryIds ?? []],
    queryFn: () => analyticsApi.getByFilter(params!),
    enabled: params !== null,
    staleTime: 0,
  })
}

export const useInvalidateAnalytics = () => {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY })
  }
}
