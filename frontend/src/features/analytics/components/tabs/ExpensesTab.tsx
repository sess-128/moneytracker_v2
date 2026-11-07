import { useEffect, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { usePeriodSummary, useTypedSummary } from '@/features/analytics/hooks/useFinanceAnalytics'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { expenseCategoryTree } from '@/features/analytics/lib/categoryTree'
import { buildMonthTotals, CHART_COLORS, groupTotal, share, sum, topCategorySeries } from '@/features/analytics/lib/aggregate'
import { plural } from '@/features/analytics/lib/period'
import { LineChart } from '@/features/analytics/components/Charts'
import { CategoryTreeColumn, useExpandedCategories } from '@/features/analytics/components/CategoryTree'
import {
  AnalyticsError,
  EmptyState,
  Legend,
  MainAsideRow,
  MetricCard,
  MetricGrid,
  Panel,
  PanelSkeleton,
} from '@/features/analytics/components/AnalyticsBlocks'
import type { TabProps } from './types'

const PALETTE = [CHART_COLORS.green, CHART_COLORS.red, CHART_COLORS.purple]
const STRUCTURE_BAR_MAX = 140

const joinNames = (names: string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} и ${names[names.length - 1]}`

export const ExpensesTab = ({ period, keys, labels }: TabProps) => {
  const expenses = useTypedSummary('EXPENSE', period)
  const summary = usePeriodSummary(period)
  const categories = useCategories()
  const { expanded, toggle, setExpanded } = useExpandedCategories()
  const roots = useMemo(() => expenseCategoryTree(
    expenses.data?.transactions ?? [],
    categories.data ?? [],
  ), [expenses.data, categories.data])

  const model = useMemo(() => {
    const series = topCategorySeries(expenses.data ? { ...expenses.data, transactions: roots } : undefined, keys, PALETTE, 'Остальные категории')
    const total = sum(roots.map(groupTotal))
    const income = sum(buildMonthTotals(summary.data, keys).map(m => m.income))
    return { series, total, income }
  }, [expenses.data, summary.data, keys, roots])

  const { series, total, income } = model

  // При открытии периода видны только родительские группы.
  useEffect(() => {
    setExpanded(new Set())
  }, [period.start, period.end, setExpanded])

  const hasData = total > 0
  const largest = roots[0]
  const named = series.filter(s => s.id !== '__others__')
  const namedShare = share(sum(named.map(s => s.total)), total)
  const maxSeriesTotal = Math.max(1, ...series.map(s => s.total))

  // Распределение не меняется при раскрытии: строки не прыгают между колонками.
  const splitIndex = Math.ceil(roots.length / 2)
  const leftRoots = roots.slice(0, splitIndex)
  const rightRoots = roots.slice(splitIndex)

  const loading = expenses.isLoading || categories.isLoading
  if (expenses.isError || summary.isError || categories.isError) return <AnalyticsError onRetry={() => { void expenses.refetch(); void summary.refetch(); void categories.refetch() }} />

  return (
    <>
      <MetricGrid>
        <MetricCard label="Расходы за период" value={formatCurrency(total)} color={CHART_COLORS.red} hint="Без переводов на свои счета" />
        <MetricCard
          label="В среднем за месяц"
          value={formatCurrency(total / Math.max(1, keys.length))}
          hint={`${keys.length} ${plural(keys.length, 'месяц', 'месяца', 'месяцев')} в периоде`}
        />
        <MetricCard
          label="Доля расходов в доходе"
          value={income > 0 ? formatPercent(share(total, income)) : '—'}
          hint={`Доходы за период · ${formatCurrency(income)}`}
        />
        <MetricCard
          label="Самая крупная категория"
          value={largest ? formatCurrency(groupTotal(largest)) : '—'}
          color={CHART_COLORS.green}
          hint={largest ? `${largest.categoryName} · ${formatPercent(share(groupTotal(largest), total))} всех расходов` : 'Нет расходов'}
        />
      </MetricGrid>

      <MainAsideRow>
        <Panel
          title="Расходы по категориям"
          subtitle={series.some(s => s.id === '__others__')
            ? `${named.length} ${plural(named.length, 'крупнейшая категория', 'крупнейшие категории', 'крупнейших категорий')}; остальные объединены, чтобы график оставался читаемым`
            : 'Все категории расходов по месяцам'}
        >
          <Legend items={series} />
          {loading ? <PanelSkeleton /> : hasData ? (
            <LineChart labels={labels} series={series} />
          ) : <EmptyState />}
        </Panel>

        <Panel
          title="Структура расходов"
          subtitle={hasData ? `Все ${roots.length} ${plural(roots.length, 'категория учтена', 'категории учтены', 'категорий учтены')}` : undefined}
        >
          {!hasData && !loading && <EmptyState>Нет расходов</EmptyState>}
          {series.map(s => (
            <div key={s.id} className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3">
                <span className="an-caption truncate" style={{ color: 'var(--an-text)' }}>
                  {s.id === '__others__' ? 'Остальные' : s.name}
                </span>
                <span className="an-caption">{formatPercent(share(s.total, total))}</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-[5px] rounded-[3px] shrink-0"
                  style={{ width: Math.max(4, (s.total / maxSeriesTotal) * STRUCTURE_BAR_MAX), background: s.color }}
                />
                <span className="an-body tabular-nums whitespace-nowrap">{formatCurrency(s.total)}</span>
              </div>
            </div>
          ))}
          {hasData && named.length > 0 && (
            <p className="an-caption">
              {formatPercent(namedShare)} расходов — {joinNames(named.map(s => s.name.toLowerCase()))}.
              {roots.length > named.length && ' Полная детализация — ниже.'}
            </p>
          )}
        </Panel>
      </MainAsideRow>

      <Panel
        title="Категории расходов"
        subtitle="По сумме ↓ · Суммы родительских категорий не складываются повторно с подкатегориями"
      >
        {loading ? <PanelSkeleton height={240} /> : !hasData ? <EmptyState /> : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
            <CategoryTreeColumn roots={leftRoots} total={total} accent={CHART_COLORS.green} expanded={expanded} onToggle={toggle} />
            {rightRoots.length > 0 && (
              <CategoryTreeColumn roots={rightRoots} total={total} expanded={expanded} onToggle={toggle} />
            )}
          </div>
        )}
      </Panel>
    </>
  )
}
