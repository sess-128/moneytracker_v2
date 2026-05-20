import { GlassCard } from '@/components/ui/GlassCard'
import { formatCurrency, getCurrentMonthLabel } from '@/utils/formatters'
import type { DashboardStats } from '../hooks/useDashboardStats'

interface StatsCardsProps {
  stats: DashboardStats
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const monthLabel = getCurrentMonthLabel()

  const items = [
    {
      label: 'Общий баланс средств',
      value: formatCurrency(stats.totalBalance),
    },
    {
      label: 'Баланс средств за тек.месяц',
      value: `${formatCurrency(stats.currentMonthTotal)} (${monthLabel})`,
    },
    {
      label: 'Средняя трата за день',
      value: formatCurrency(stats.avgDailySpend),
    },
  ]

  return (
    <GlassCard padding="md">
      <div className="grid grid-cols-3">
        {items.map(({ label, value }, i) => (
          <div key={label} className={i === 0 ? 'pr-5' : i === 2 ? 'pl-5' : 'px-5'}>
            <p className="text-white/50 text-xs leading-snug mb-2">{label}</p>
            <p className="text-white text-xl font-semibold tracking-tight leading-tight">{value}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
