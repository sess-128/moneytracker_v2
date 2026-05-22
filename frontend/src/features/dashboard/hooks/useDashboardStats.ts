import { useMemo } from 'react'
import type { TransactionResponse } from '@/types/api.types'
import { getCurrentMonthRange } from '@/utils/formatters'

export interface DashboardStats {
  totalBalance: number
  currentMonthTotal: number
  avgDailySpend: number
}

export const useDashboardStats = (transactions: TransactionResponse[] | undefined): DashboardStats => {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalBalance: 0, currentMonthTotal: 0, avgDailySpend: 0 }
    }

    const { startDate, endDate } = getCurrentMonthRange()
    const monthStart = new Date(startDate)
    const monthEnd = new Date(endDate)

    const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)

    const monthlyTransactions = transactions.filter((t) => {
      if (!t.transactionDate) return false
      const d = new Date(t.transactionDate)
      return d >= monthStart && d <= monthEnd
    })

    const currentMonthTotal = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)
    const daysInMonth = monthEnd.getDate()
    const avgDailySpend = daysInMonth > 0 ? Math.abs(currentMonthTotal) / daysInMonth : 0

    return { totalBalance, currentMonthTotal, avgDailySpend }
  }, [transactions])
}
