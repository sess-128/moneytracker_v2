import { useMemo } from 'react'
import { useTypedSummary } from '@/features/analytics/hooks/useFinanceAnalytics'
import { aggregateRootSummaryAmounts, currentMonthPeriod } from '../lib/categoryAmounts'

export const useMonthlyCategoryAmounts = () => {
  const period = currentMonthPeriod()
  const expenses = useTypedSummary('EXPENSE', period)
  const income = useTypedSummary('INCOME', period)
  const savings = useTypedSummary('SAVINGS', period)
  const categories = useMemo(() => aggregateRootSummaryAmounts([
    ...(expenses.data?.transactions ?? []),
    ...(income.data?.transactions ?? []),
    ...(savings.data?.transactions ?? []),
  ]), [expenses.data, income.data, savings.data])

  return {
    categories,
    isLoading: expenses.isPending || income.isPending || savings.isPending,
    isError: expenses.isError || income.isError || savings.isError,
    retry: () => { void Promise.all([expenses.refetch(), income.refetch(), savings.refetch()]) },
  }
}
