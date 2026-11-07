import { useMemo } from 'react'
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/utils/formatters'
import { usePeriodSummary, useSavingsOpening, useTypedSummary } from '@/features/analytics/hooks/useFinanceAnalytics'
import { buildMonthTotals, CHART_COLORS, savingsFlow, savingsTotal, share, sum } from '@/features/analytics/lib/aggregate'
import { formatDayMonth, formatDayMonthShort } from '@/features/analytics/lib/period'
import { BarChart, LineChart } from '@/features/analytics/components/Charts'
import {
  DataTable,
  AnalyticsError,
  EmptyState,
  Legend,
  MainAsideRow,
  MetricCard,
  MetricGrid,
  Panel,
  PanelSkeleton,
  ValueRow,
} from '@/features/analytics/components/AnalyticsBlocks'
import type { TabProps } from './types'

export const SavingsTab = ({ period, keys, labels }: TabProps) => {
  const savings = useTypedSummary('SAVINGS', period)
  const opening = useSavingsOpening(period)
  const summary = usePeriodSummary(period)

  const model = useMemo(() => {
    const flow = savingsFlow(savings.data, keys)
    const openingBalance = savingsTotal(opening.data)
    const balances = flow.net.reduce<number[]>((acc, v) => [...acc, (acc[acc.length - 1] ?? openingBalance) + v], [])
    const months = buildMonthTotals(summary.data, keys)
    const income = sum(months.map(m => m.income))
    const expense = sum(months.map(m => m.expense))
    return {
      flow,
      openingBalance,
      balances,
      closingBalance: balances[balances.length - 1] ?? openingBalance,
      deposits: sum(flow.deposits),
      withdrawals: sum(flow.withdrawals),
      saved: sum(flow.net),
      income,
      expense,
    }
  }, [savings.data, opening.data, summary.data, keys])

  const loading = savings.isLoading || opening.isLoading
  const hasFlow = model.deposits > 0 || model.withdrawals > 0
  const hasBalance = hasFlow || model.openingBalance !== 0
  const rest = model.income - model.expense

  if (savings.isError || opening.isError || summary.isError) return <AnalyticsError onRetry={() => { void savings.refetch(); void opening.refetch(); void summary.refetch() }} />

  return (
    <>
      <MetricGrid>
        <MetricCard
          label="Отложено за период"
          value={formatCurrency(model.saved)}
          color={CHART_COLORS.purple}
          hint={`${formatCurrency(model.deposits)} пополнений − ${formatCurrency(model.withdrawals)} снятий`}
        />
        <MetricCard
          label="Всего накоплено"
          value={formatCurrency(model.closingBalance)}
          color={CHART_COLORS.blue}
          hint={`Баланс на ${formatDayMonth(period.end, true)}`}
        />
        <MetricCard
          label="Остаток"
          value={formatCurrency(rest)}
          hint={<>Доходы {formatCurrency(model.income)}<br />− расходы {formatCurrency(model.expense)}</>}
        />
        <MetricCard
          label="Доля отложенного в доходах"
          value={model.income > 0 ? formatPercent(share(model.saved, model.income)) : '—'}
          hint={`${formatCurrency(model.saved)} из ${formatCurrency(model.income)}`}
        />
      </MetricGrid>

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <Panel title="Баланс накоплений во времени" subtitle="На начало периода и конец каждого месяца · Не месячный доход">
          <Legend items={[{ name: 'Баланс накоплений', color: CHART_COLORS.blue }]} />
          {loading ? <PanelSkeleton /> : hasBalance ? (
            <LineChart
              labels={[formatDayMonthShort(period.start), ...labels]}
              series={[{ id: 'balance', name: 'Баланс', color: CHART_COLORS.blue, values: [model.openingBalance, ...model.balances] }]}
            />
          ) : <EmptyState>Накоплений пока нет</EmptyState>}
          <p className="an-caption">
            {formatCurrency(model.openingBalance)} на начало → {formatCurrency(model.closingBalance)} на конец периода
          </p>
        </Panel>

        <Panel title="Пополнения и снятия по месяцам" subtitle="Отложено = пополнения − снятия · Это поток, а не баланс">
          <Legend
            items={[
              { name: 'Пополнения', color: CHART_COLORS.green },
              { name: 'Снятия', color: CHART_COLORS.red },
              { name: 'Отложено', color: CHART_COLORS.purple },
            ]}
          />
          {loading ? <PanelSkeleton /> : hasFlow ? (
            <BarChart
              labels={labels}
              maxBarWidth={20}
              series={[
                { id: 'deposits', name: 'Пополнения', color: CHART_COLORS.green, values: model.flow.deposits },
                { id: 'withdrawals', name: 'Снятия', color: CHART_COLORS.red, values: model.flow.withdrawals },
                { id: 'net', name: 'Отложено', color: CHART_COLORS.purple, values: model.flow.net },
              ]}
            />
          ) : <EmptyState>Нет пополнений и снятий за период</EmptyState>}
          <p className="an-caption">
            Пополнения {formatCurrency(model.deposits)} · Снятия {formatCurrency(model.withdrawals)} · Отложено {formatCurrency(model.saved)}
          </p>
        </Panel>
      </div>

      <MainAsideRow>
        <Panel title="Движение накоплений" subtitle="Баланс увеличивается на чистую сумму отложенного за месяц">
          {loading ? <PanelSkeleton height={240} /> : (
            <DataTable
              columns={['Месяц', 'Пополнения', 'Снятия', 'Отложено', 'Баланс на конец']}
              rows={keys.map((_, i) => [
                { value: labels[i] },
                { value: formatCurrency(model.flow.deposits[i]) },
                { value: formatCurrency(model.flow.withdrawals[i]) },
                { value: formatCurrency(model.flow.net[i]), color: CHART_COLORS.purple, strong: true },
                { value: formatCurrency(model.balances[i]), color: CHART_COLORS.blue, strong: true },
              ])}
              footer={[
                { value: 'За период' },
                { value: formatCurrency(model.deposits) },
                { value: formatCurrency(model.withdrawals) },
                { value: formatCurrency(model.saved), color: CHART_COLORS.purple },
                { value: formatCurrency(model.closingBalance), color: CHART_COLORS.blue },
              ]}
            />
          )}
        </Panel>

        <Panel title="Как считается баланс">
          <ValueRow label={`На ${formatDayMonth(period.start)}`} value={formatCurrency(model.openingBalance)} />
          <ValueRow label="Пополнения" value={formatSignedCurrency(model.deposits)} color={CHART_COLORS.green} />
          <ValueRow label="Снятия" value={formatSignedCurrency(-model.withdrawals)} color={CHART_COLORS.red} />
          <ValueRow label={`На ${formatDayMonth(period.end)}`} value={formatCurrency(model.closingBalance)} color={CHART_COLORS.blue} />
          <p className="an-caption">
            Остаток {formatCurrency(rest)} не равен балансу.
            {rest > 0
              ? ` Из него ${formatCurrency(model.saved)} отложено, ${formatCurrency(rest - model.saved)} осталось не распределено.`
              : ' Расходы за период не меньше доходов, поэтому свободного остатка нет.'}
          </p>
        </Panel>
      </MainAsideRow>
    </>
  )
}
