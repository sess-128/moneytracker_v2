import type { AnalyticsTransactionGroup } from '@/types/api.types'
import { toLocalISO } from '@/features/analytics/lib/period'

export const currentMonthPeriod = (now = new Date()) => ({
  start: toLocalISO(new Date(now.getFullYear(), now.getMonth(), 1)),
  end: toLocalISO(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
})

/** Root summaries already include descendants, so children must not be summed again. */
export const aggregateRootSummaryAmounts = (groups: AnalyticsTransactionGroup[]) => {
  const amounts = new Map<string, { id: string; name: string; amount: number }>()
  for (const group of groups) {
    const root = amounts.get(group.categoryId) ?? { id: group.categoryId, name: group.categoryName, amount: 0 }
    root.amount += group.summary.sum
    amounts.set(root.id, root)
  }
  return [...amounts.values()].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
}
