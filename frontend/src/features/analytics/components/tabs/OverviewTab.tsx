import { useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { usePeriodSummary, useSavingsOpening, useTypedSummary } from '@/features/analytics/hooks/useFinanceAnalytics'
import { buildMonthTotals, CHART_COLORS, savingsFlow, savingsTotal, share, sum } from '@/features/analytics/lib/aggregate'
import { formatDayMonth, plural } from '@/features/analytics/lib/period'
import { BarChart } from '@/features/analytics/components/Charts'
import {
  DataTable,
  AnalyticsError,
  EmptyState,
  InsightCard,
  Legend,
  MainAsideRow,
  MetricCard,
  MetricGrid,
  Panel,
  PanelSkeleton,
  ValueRow,
} from '@/features/analytics/components/AnalyticsBlocks'
import type { TabProps } from './types'

export const OverviewTab = ({ period, keys, labels, totalLabel }: TabProps) => {
  const summary = usePeriodSummary(period)
  const savings = useTypedSummary('SAVINGS', period)
  const opening = useSavingsOpening(period)

  const model = useMemo(() => {
    const months = buildMonthTotals(summary.data, keys)
    const flow = savingsFlow(savings.data, keys)
    const income = sum(months.map(m => m.income))
    const expense = sum(months.map(m => m.expense))
    const saved = sum(flow.net)
    const rest = income - expense
    const n = Math.max(1, keys.length)
    return {
      months,
      flow,
      income,
      expense,
      saved,
      rest,
      unallocated: rest - saved,
      avgIncome: income / n,
      avgExpense: expense / n,
      monthsBelowIncome: months.filter(m => m.expense < m.income).length,
      savingsBalance: savingsTotal(opening.data) + saved,
    }
  }, [summary.data, savings.data, opening.data, keys])

  const loading = summary.isLoading
  const hasData = model.income > 0 || model.expense > 0
  const savedShareOfRest = model.rest > 0 ? share(Math.max(0, model.saved), model.rest) : 0

  if (summary.isError || savings.isError || opening.isError) return <AnalyticsError onRetry={() => { void summary.refetch(); void savings.refetch(); void opening.refetch() }} />

  return (
    <>
      <MetricGrid>
        <MetricCard
          label="Доходы за период"
          value={formatCurrency(model.income)}
          color={CHART_COLORS.green}
          hint={`${formatCurrency(model.avgIncome)} в среднем за месяц`}
        />
        <MetricCard
          label="Расходы за период"
          value={formatCurrency(model.expense)}
          color={CHART_COLORS.red}
          hint={`${formatCurrency(model.avgExpense)} в среднем за месяц`}
        />
        <MetricCard label="Остаток" value={formatCurrency(model.rest)} hint="Доходы минус расходы" />
        <MetricCard
          label="Отложено за период"
          value={formatCurrency(model.saved)}
          color={CHART_COLORS.purple}
          hint="Пополнения минус снятия"
        />
      </MetricGrid>

      <MainAsideRow>
        <Panel title="Доходы и расходы" subtitle="Сравнение по месяцам · Без детализации по категориям">
          <Legend items={[{ name: 'Доходы', color: CHART_COLORS.green }, { name: 'Расходы', color: CHART_COLORS.red }]} />
          {loading ? <PanelSkeleton /> : hasData ? (
            <BarChart
              labels={labels}
              series={[
                { id: 'income', name: 'Доходы', color: CHART_COLORS.green, values: model.months.map(m => m.income) },
                { id: 'expense', name: 'Расходы', color: CHART_COLORS.red, values: model.months.map(m => m.expense) },
              ]}
            />
          ) : <EmptyState />}
        </Panel>

        <Panel title="Как распределился остаток" subtitle={`${formatCurrency(model.rest)} после всех расходов`}>
          {model.rest > 0 ? (
            <>
              <p className="an-title1" style={{ color: CHART_COLORS.purple }}>{formatPercent(savedShareOfRest, 0)}</p>
              <div className="flex gap-[3px] w-full">
                {savedShareOfRest > 0 && (
                  <div className="h-2 rounded-[3px]" style={{ width: `${Math.min(100, savedShareOfRest)}%`, background: CHART_COLORS.purple }} />
                )}
                {savedShareOfRest < 100 && <div className="h-2 rounded-[3px] flex-1" style={{ background: 'var(--an-rest)' }} />}
              </div>
            </>
          ) : (
            <p className="an-caption">
              {hasData ? `Расходы превысили доходы на ${formatCurrency(Math.abs(model.rest))}.` : 'Нет данных за период.'}
            </p>
          )}
          <ValueRow label="Отложено" value={formatCurrency(model.saved)} color={CHART_COLORS.purple} />
          <ValueRow label="Не распределено" value={formatCurrency(model.unallocated)} />
          <p className="an-caption">
            Остаток — это не баланс накоплений. Его часть можно отложить или оставить на текущих счетах.
          </p>
        </Panel>
      </MainAsideRow>

      <MainAsideRow>
        <Panel title="Итоги по месяцам">
          {loading ? <PanelSkeleton height={240} /> : (
            <DataTable
              columns={['Месяц', 'Доходы', 'Расходы', 'Остаток', 'Отложено']}
              rows={model.months.map((m, i) => [
                { value: labels[i] },
                { value: formatCurrency(m.income), color: CHART_COLORS.green },
                { value: formatCurrency(m.expense), color: CHART_COLORS.red },
                { value: formatCurrency(m.income - m.expense) },
                { value: formatCurrency(model.flow.net[i]), color: CHART_COLORS.purple },
              ])}
            />
          )}
        </Panel>

        <Panel title={totalLabel}>
          {hasData && (
            <InsightCard title={model.expense <= model.income ? 'Расходы ниже доходов' : 'Расходы выше доходов'}>
              {keys.length === 1
                ? ''
                : model.monthsBelowIncome === keys.length
                  ? `Во всех ${keys.length} месяцах. `
                  : `В ${model.monthsBelowIncome} из ${keys.length} ${plural(keys.length, 'месяца', 'месяцев', 'месяцев')}. `}
              {model.income > 0
                ? `На расходы ушло ${formatPercent(share(model.expense, model.income))} дохода.`
                : 'Доходов за период нет.'}
            </InsightCard>
          )}
          <InsightCard title={`Всего накоплено ${formatCurrency(model.savingsBalance)}`}>
            Баланс на {formatDayMonth(period.end)}. Динамика баланса и пополнения — во вкладке «Накопления».
          </InsightCard>
        </Panel>
      </MainAsideRow>
    </>
  )
}
