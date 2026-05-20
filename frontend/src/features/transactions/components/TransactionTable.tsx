import { GlassCard } from '@/components/ui/GlassCard'
import type { TransactionResponse } from '@/types/api.types'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface TransactionTableProps {
  transactions: TransactionResponse[]
}

const resolveType = (amount: number) => {
  if (amount > 0) return { label: 'ДОХОД', className: 'text-green-400' }
  if (amount < 0) return { label: 'РАСХОД', className: 'text-red-400' }
  return { label: 'СБЕРЕЖЕНИЕ', className: 'text-blue-400' }
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => (
  <GlassCard padding="md" className="flex flex-col flex-1 min-h-0">
    {/* Header row */}
    <div
      className="grid items-center gap-3 text-white/40 text-xs uppercase tracking-wider pb-2.5 flex-shrink-0 px-1"
      style={{ gridTemplateColumns: '32px 1fr 100px 90px 80px 52px' }}
    >
      <span />
      <span>Категория</span>
      <span>Тип</span>
      <span>Сумма</span>
      <span>Дата</span>
      <span />
    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto mt-1 flex flex-col gap-0.5 pr-0.5">
      {transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center pt-8">
          <p className="text-white/25 text-sm">Нет транзакций</p>
        </div>
      ) : (
        transactions.map((tx) => {
          const type = resolveType(tx.amount)
          return (
            <div
              key={tx.id}
              className="grid items-center gap-3 py-2 px-1 rounded-xl hover:bg-white/5 transition-colors duration-150"
              style={{ gridTemplateColumns: '32px 1fr 100px 90px 80px 52px' }}
            >
              <img
                src="/avatar.png"
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
              />
              <span className="text-white text-sm truncate">{tx.categoryName}</span>
              <span className={`text-xs font-semibold ${type.className}`}>{type.label}</span>
              <span className="text-white text-sm">{formatCurrency(tx.amount)}</span>
              <span className="text-white/50 text-xs">{formatDate(tx.startDate)}</span>
              <button className="glass-btn text-white text-xs rounded-lg px-2.5 py-1 flex items-center justify-center">
                Edit
              </button>
            </div>
          )
        })
      )}
    </div>
  </GlassCard>
)
