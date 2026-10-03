import { GlassCard } from '@/components/ui/GlassCard'
import { formatCurrency } from '@/utils/formatters'
import type { AnalyticsFilterResponse } from '@/types/api.types'

const COLORS = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#db2777', '#dc2626', '#0e7490',
  '#047857', '#b45309', '#be185d', '#b91c1c',
]

interface TopCategoriesProps {
  data: AnalyticsFilterResponse[]
}

export const TopCategories = ({ data }: TopCategoriesProps) => {
  const sorted = [...data].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
  const maxAmount = sorted.length > 0 ? parseFloat(sorted[0].amount) : 0

  return (
    <GlassCard padding="lg">
      <div className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">ТОП КАТЕГОРИЙ</p>

        {sorted.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-white/25 text-sm">Нет данных</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((item, index) => {
              const amount = parseFloat(item.amount)
              const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0

              return (
                <div key={item.categoryName} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-white/65 text-xs truncate flex-1 min-w-0">
                    {item.categoryName}
                  </span>
                  <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${barWidth}%`,
                        background: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-white text-sm font-semibold tabular-nums flex-shrink-0">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-white/30 text-xs tabular-nums flex-shrink-0 w-8 text-right">
                    {item.countOfTransactions}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
