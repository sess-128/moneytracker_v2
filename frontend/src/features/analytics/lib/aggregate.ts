import type {
  AnalyticsSummaryResponse,
  AnalyticsTransactionGroup,
  AnalyticsTransactionItem,
  AnalyticsTypedSummaryResponse,
} from '@/types/api.types'

export const CHART_COLORS = {
  green: 'var(--an-green)',
  red: 'var(--an-red)',
  purple: 'var(--an-purple)',
  blue: 'var(--an-blue)',
  neutral: 'var(--an-neutral)',
} as const

export interface Series {
  id: string
  name: string
  color: string
  /** значения по месяцам, в порядке ключей месяцев */
  values: number[]
  total: number
  /** число операций */
  count: number
}

export interface MonthTotals {
  key: string
  income: number
  expense: number
}

const num = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export const sum = (values: number[]): number => values.reduce((acc, v) => acc + v, 0)

export const monthKeyOf = (isoDateTime: string): string => isoDateTime.slice(0, 7)

/** Доходы и расходы по месяцам из /analytics/summary */
export const buildMonthTotals = (summary: AnalyticsSummaryResponse | undefined, keys: string[]): MonthTotals[] => {
  const byKey = new Map<string, MonthTotals>()
  summary?.years.forEach(year =>
    year.months.forEach(m => {
      const key = `${year.year}-${String(m.month).padStart(2, '0')}`
      byKey.set(key, { key, income: num(m.summary.income), expense: num(m.summary.expense) })
    }),
  )
  return keys.map(key => byKey.get(key) ?? { key, income: 0, expense: 0 })
}

/** Все операции поддерева категории */
export const subtreeItems = (group: AnalyticsTransactionGroup): AnalyticsTransactionItem[] => [
  ...group.items,
  ...group.childCategories.flatMap(subtreeItems),
]

export const allItems = (data: AnalyticsTypedSummaryResponse | undefined): AnalyticsTransactionItem[] =>
  data?.transactions.flatMap(subtreeItems) ?? []

/** Сумма операций по месяцам */
export const monthlyValues = (items: AnalyticsTransactionItem[], keys: string[]): number[] => {
  const index = new Map(keys.map((k, i) => [k, i]))
  const values = keys.map(() => 0)
  items.forEach(item => {
    const i = index.get(monthKeyOf(item.transactionDate))
    if (i !== undefined) values[i] += num(item.amount)
  })
  return values
}

export const groupTotal = (group: AnalyticsTransactionGroup): number => num(group.summary.sum)

export const sortGroups = (groups: AnalyticsTransactionGroup[]): AnalyticsTransactionGroup[] =>
  [...groups].sort((a, b) => groupTotal(b) - groupTotal(a))

/**
 * Корневые категории как ряды графика: top N получают цвета,
 * остальные объединяются в один нейтральный ряд.
 */
export const topCategorySeries = (
  data: AnalyticsTypedSummaryResponse | undefined,
  keys: string[],
  palette: string[],
  othersName: string,
): Series[] => {
  const roots = sortGroups(data?.transactions ?? [])
  const toSeries = (group: AnalyticsTransactionGroup, color: string): Series => {
    const items = subtreeItems(group)
    const values = monthlyValues(items, keys)
    return { id: group.categoryId, name: group.categoryName, color, values, total: groupTotal(group), count: items.length }
  }

  // Если категорий ровно на одну больше, чем цветов, показываем её отдельно вместо «Остальных»
  const limit = roots.length === palette.length + 1 ? roots.length : palette.length
  const head = roots.slice(0, limit).map((g, i) => toSeries(g, palette[i] ?? CHART_COLORS.neutral))
  const tail = roots.slice(limit)
  if (tail.length === 0) return head

  const tailItems = tail.flatMap(subtreeItems)
  return [
    ...head,
    {
      id: '__others__',
      name: othersName,
      color: CHART_COLORS.neutral,
      values: monthlyValues(tailItems, keys),
      total: sum(tail.map(groupTotal)),
      count: tailItems.length,
    },
  ]
}

/** Пополнения (amount > 0) и снятия (amount < 0) накоплений по месяцам */
export const savingsFlow = (data: AnalyticsTypedSummaryResponse | undefined, keys: string[]) => {
  const items = allItems(data)
  const deposits = monthlyValues(items.filter(i => num(i.amount) > 0), keys)
  const withdrawals = monthlyValues(items.filter(i => num(i.amount) < 0), keys).map(v => Math.abs(v))
  const net = deposits.map((d, i) => d - withdrawals[i])
  return { deposits, withdrawals, net }
}

export const savingsTotal = (data: AnalyticsTypedSummaryResponse | undefined): number =>
  sum(allItems(data).map(i => num(i.amount)))

export const share = (part: number, total: number): number => (total > 0 ? (part / total) * 100 : 0)
