import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionsApi } from '@/api/transactions.api'
import type { TransactionRequest } from '@/types/api.types'

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const

export const useTransactions = () =>
  useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: transactionsApi.getAll,
  })

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransactionRequest) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
  })
}
