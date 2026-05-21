import { StatsCards } from '@/features/dashboard/components/StatsCards'
import { MonthlyExpenses } from '@/features/dashboard/components/MonthlyExpenses'
import { TransactionForm } from '@/features/transactions/components/TransactionForm'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

export const MainPage = () => {
  useCurrentUser()
  const { data: transactions = [] } = useTransactions()
  const stats = useDashboardStats(transactions)

  return (
    <div className="flex-1 grid gap-3 min-h-0" style={{ gridTemplateColumns: '44% 1fr' }}>
      <div className="flex flex-col gap-3 min-h-0">
        <StatsCards stats={stats} />
        <MonthlyExpenses />
      </div>
      <div className="flex flex-col gap-3 min-h-0">
        <TransactionForm />
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  )
}
