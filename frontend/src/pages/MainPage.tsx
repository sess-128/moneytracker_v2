import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
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
    <motion.div
      className="h-screen overflow-hidden flex flex-col relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Wallpaper background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/wallpaper.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay so cards/text are readable */}
      <div className="absolute inset-0" style={{ background: 'rgba(4, 2, 12, 0.55)' }} />

      <div className="relative z-10 flex flex-col h-full p-4 gap-3">
        <Navbar />

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
      </div>
    </motion.div>
  )
}
