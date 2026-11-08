import { formatCurrency, getCurrentMonthLabel } from '@/utils/formatters'
import type { DashboardStats } from '../hooks/useDashboardStats'

export const StatsCards = ({ stats }: { stats: DashboardStats }) => {
  const items = [
    { label: 'Общий баланс средств', value: stats.totalBalance, caption: 'Все операции' },
    { label: 'Баланс средств за текущий месяц', value: stats.currentMonthTotal, caption: getCurrentMonthLabel().replace(/^./, letter => letter.toUpperCase()) },
    { label: 'Средняя трата за день', value: stats.avgDailySpend, caption: 'Текущий месяц' },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ label, value, caption }, i) => (
        <section key={label} className="an-card flex flex-col gap-1.5 px-5 py-5">
          <h2 className="an-caption">{label}</h2>
          <p className="an-body" style={i === 0 ? { color: 'var(--an-chip-border)' } : undefined}>{formatCurrency(value)}</p>
          <p className="an-caption">{caption}</p>
        </section>
      ))}
    </div>
  )
}
