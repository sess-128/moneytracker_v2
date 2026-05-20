import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/api/categories.api'

export const CATEGORIES_QUERY_KEY = ['categories'] as const

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000,
  })
