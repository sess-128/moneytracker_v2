import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics.api'
import type { CategoryType } from '@/types/api.types'
import { addDays, type Period } from '@/features/analytics/lib/period'

export const FINANCE_ANALYTICS_QUERY_KEY = ['analytics', 'finance'] as const

/** Самая ранняя дата, с которой бэкенд считает накопления (значение по умолчанию в контракте) */
const HISTORY_START = '2000-01-01'

/**
 * Бэкенд отсекает endDate по началу дня, поэтому, чтобы включить
 * последний день периода, передаём следующий день.
 */
const toRequest = (period: Period) => ({
  startDate: period.start,
  endDate: addDays(period.end, 1),
})

/**
 * Бэкенд по умолчанию фильтрует amount >= 0. Для накоплений передаём
 * отрицательную нижнюю границу, чтобы учесть снятия, если они записаны со знаком минус.
 */
const SAVINGS_MIN_AMOUNT = -1_000_000_000_000

/** Доходы/расходы/накопления по месяцам */
export const usePeriodSummary = (period: Period) =>
  useQuery({
    queryKey: [...FINANCE_ANALYTICS_QUERY_KEY, 'summary', period.start, period.end],
    queryFn: () => analyticsApi.getSummary(toRequest(period)),
  })

/** Дерево категорий с операциями для одного типа */
export const useTypedSummary = (type: CategoryType, period: Period, enabled = true) =>
  useQuery({
    queryKey: [...FINANCE_ANALYTICS_QUERY_KEY, 'by-type', type, period.start, period.end],
    queryFn: () =>
      analyticsApi.getTypedSummary({
        type,
        ...toRequest(period),
        ...(type === 'SAVINGS' ? { minAmount: SAVINGS_MIN_AMOUNT } : {}),
      }),
    enabled,
  })

/** Накопления до начала периода — баланс «на начало» */
export const useSavingsOpening = (period: Period, enabled = true) =>
  useQuery({
    queryKey: [...FINANCE_ANALYTICS_QUERY_KEY, 'savings-opening', period.start],
    queryFn: () =>
      analyticsApi.getTypedSummary({
        type: 'SAVINGS',
        startDate: HISTORY_START,
        endDate: period.start, // не включительно — ровно до начала периода
        minAmount: SAVINGS_MIN_AMOUNT,
      }),
    enabled,
  })
