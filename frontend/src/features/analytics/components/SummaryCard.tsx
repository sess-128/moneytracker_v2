import { GlassCard } from '@/components/ui/GlassCard'
import { formatCurrency } from '@/utils/formatters'
import type { TransactionResponse } from '@/types/api.types'

interface SummaryCardProps {
  transactions: TransactionResponse[]
}

export const SummaryCard = ({ transactions }: SummaryCardProps) => {
  const income = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const cash = income - expense
  const expensePercent = income > 0 ? Math.round((expense / income) * 100) : 0

  return (
    <GlassCard padding="lg">
      <div className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Итог за период</p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Доход</span>
            <span className="text-emerald-400 text-lg font-semibold tabular-nums">
              {formatCurrency(income)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Расход</span>
            <span className="text-rose-400 text-lg font-semibold tabular-nums">
              {formatCurrency(expense)} ({expensePercent}% категории)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Наличные</span>
            <span className="text-white text-lg font-semibold tabular-nums">
              {formatCurrency(cash)}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
