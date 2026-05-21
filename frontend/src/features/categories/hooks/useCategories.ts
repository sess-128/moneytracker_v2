import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/categories.api'
import { useAuthStore } from '@/store/authStore'

export const CATEGORIES_QUERY_KEY = ['categories'] as const

export const useCategories = () => {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(token),
  })
}
