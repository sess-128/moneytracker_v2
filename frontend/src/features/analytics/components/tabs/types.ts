import type { Period } from '@/features/analytics/lib/period'

export interface TabProps {
  period: Period
  /** ключи месяцев yyyy-MM */
  keys: string[]
  /** подписи месяцев для осей и таблиц */
  labels: string[]
  /** «За полгода», «За период» … */
  totalLabel: string
}
