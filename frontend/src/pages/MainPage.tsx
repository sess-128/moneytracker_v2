import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { MonthlyExpenses } from '@/features/dashboard/components/MonthlyExpenses'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { useTransactionsFlat } from '@/features/transactions/hooks/useTransactions'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'

export const MainPage = () => {
  const { data: transactions = [], isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, isError, refetch } = useTransactionsFlat()
  const stats = useDashboardStats(transactions)

  return (
    <main className="dashboard flex flex-col gap-6">
      <div>
        <h1 className="an-title1">Финансовый обзор</h1>
        <p className="an-caption mt-1">Ваши средства, категории и последние операции</p>
      </div>
      <StatsCards stats={stats} />
      <div className="dashboard-grid">
        <MonthlyExpenses />
        <div className="flex min-w-0 flex-col gap-6">
          <TransactionForm />
          <TransactionTable transactions={transactions} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isLoading={isLoading} isError={isError} retry={() => { void refetch() }} />
        </div>
      </div>
    </main>
  )
}
