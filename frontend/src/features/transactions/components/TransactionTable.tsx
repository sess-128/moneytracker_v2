import { GlassCard } from '@/components/ui/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/authStore'
import { useDeleteTransaction } from '@/features/transactions/hooks/useTransactions'
import type { TransactionResponse, CategoryType } from '@/types/api.types'
import { formatCurrency, formatDate } from '@/utils/formatters'

const getTypeConfig = (type: CategoryType) => {
  switch (type) {
    case 'INCOME':
      return { label: 'ДОХОД', className: 'text-emerald-400' }
    case 'SAVINGS':
      return { label: 'НАКОПЛЕНИЕ', className: 'text-blue-400' }
    case 'EXPENSE':
    default:
      return { label: 'РАСХОД', className: 'text-red-400' }
  }
}

interface TransactionTableProps {
  transactions: TransactionResponse[]
}



export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const username = useAuthStore((s) => s.user?.login ?? '')
  const { mutate: deleteTx } = useDeleteTransaction()

  const handleDelete = (id: string, categoryName: string) => {
    if (!window.confirm(`Удалить транзакцию из «${categoryName}»?`)) return
    deleteTx(id)
  }

  return (
    <GlassCard padding="md" className="flex flex-col flex-1 min-h-0">
      <div
        className="grid items-center gap-3 text-white/40 text-xs uppercase tracking-wider pb-2.5 flex-shrink-0 px-1"
        style={{ gridTemplateColumns: '32px 1fr 90px 90px 80px 52px' }}
      >
        <span />
        <span>Категория</span>
        <span>Тип</span>
        <span>Сумма</span>
        <span>Дата</span>
        <span />
      </div>

      <div className="flex-1 overflow-y-auto mt-1 flex flex-col gap-0.5 pr-0.5">
        {transactions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center pt-8">
            <p className="text-white/25 text-sm">Нет транзакций</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const typeConfig = getTypeConfig(tx.type)
            return (
              <div
                key={tx.id}
                className="grid items-center gap-3 py-2 px-1 rounded-xl hover:bg-white/5 transition-colors duration-150"
                style={{ gridTemplateColumns: '32px 1fr 90px 90px 80px 52px' }}
              >
                <Avatar username={username} size={32} />
                <span className="text-white text-sm truncate">{tx.categoryName}</span>
                <span className={`text-xs font-semibold ${typeConfig.className}`}>{typeConfig.label}</span>
                <span className="text-white text-sm">{formatCurrency(tx.amount)}</span>
                <span className="text-white/50 text-xs">
                  {tx.transactionDate ? formatDate(tx.transactionDate) : '—'}
                </span>
                <button
                  onClick={() => handleDelete(tx.id, tx.categoryName)}
                  className="glass-btn rounded-lg p-1.5 text-rose-400/60 hover:text-rose-400 transition-colors"
                  title="Удалить"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <path d="M10 11v5M14 11v5" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>
    </GlassCard>
  )
}
