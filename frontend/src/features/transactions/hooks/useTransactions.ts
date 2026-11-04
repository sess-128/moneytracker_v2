import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/api/transactions.api'
import type { TransactionCreateRequest } from '@/types/api.types'

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const

export const useTransactions = () =>
  useInfiniteQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: ({ pageParam }) => transactionsApi.getPage(pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  })

export const useTransactionsFlat = () => {
  const query = useTransactions()
  const { data, ...rest } = query

  const flat = data?.pages.flatMap((page) => page.items) ?? []

  return { ...rest, data: flat }
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransactionCreateRequest) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
  })
}
