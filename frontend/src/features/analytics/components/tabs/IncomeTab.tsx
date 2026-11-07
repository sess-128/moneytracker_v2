import { useMemo } from 'react'
import { formatCurrency, formatPercent, formatSignedCurrency, formatSignedPercent } from '@/utils/formatters'
import { useTypedSummary } from '@/features/analytics/hooks/useFinanceAnalytics'
import { CHART_COLORS, share, sum, topCategorySeries } from '@/features/analytics/lib/aggregate'
import { monthDative, monthLongLabel, plural } from '@/features/analytics/lib/period'
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
  ShareBar,
} from '@/features/analytics/components/AnalyticsBlocks'
import type { TabProps } from './types'

const PALETTE = [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.purple]

export const IncomeTab = ({ period, keys, labels }: TabProps) => {
  const income = useTypedSummary('INCOME', period)

  const model = useMemo(() => {
    const series = topCategorySeries(income.data, keys, PALETTE, 'Остальные источники')
    const monthly = keys.map((_, i) => sum(series.map(s => s.values[i])))
    const total = sum(series.map(s => s.total))
    const maxIndex = monthly.reduce((best, v, i) => (v > monthly[best] ? i : best), 0)
    return { series, monthly, total, maxIndex }
  }, [income.data, keys])

  const { series, monthly, total, maxIndex } = model
  const main = series[0]
  const hasData = total > 0
  const first = monthly[0] ?? 0
  const last = monthly[monthly.length - 1] ?? 0

  // Источник с наибольшим приростом между первым и последним месяцем
  const growth = series
    .map(s => ({ name: s.name, delta: (s.values[s.values.length - 1] ?? 0) - (s.values[0] ?? 0) }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0]

  const mainValues = main?.values ?? []
  const mainStable = mainValues.length > 1 && mainValues.every(v => v === mainValues[0]) && mainValues[0] > 0

  if (income.isError) return <AnalyticsError onRetry={() => { void income.refetch() }} />

  return (
    <>
      <MetricGrid>
        <MetricCard label="Доходы за период" value={formatCurrency(total)} color={CHART_COLORS.green} hint="Все внешние поступления" />
        <MetricCard
          label="В среднем за месяц"
          value={formatCurrency(total / Math.max(1, keys.length))}
          hint={`${keys.length} ${plural(keys.length, 'месяц', 'месяца', 'месяцев')} в периоде`}
        />
        <MetricCard
          label="Основной источник"
          value={main ? formatPercent(share(main.total, total)) : '—'}
          hint={main ? `${main.name} · ${formatCurrency(main.total)}` : 'Нет поступлений'}
        />
        <MetricCard
          label="Максимум за месяц"
          value={formatCurrency(monthly[maxIndex] ?? 0)}
          color={CHART_COLORS.green}
          hint={hasData ? `${monthLongLabel(keys[maxIndex])} ${keys[maxIndex].slice(0, 4)}` : '—'}
        />
      </MetricGrid>

      <MainAsideRow>
        <Panel title="Динамика доходов" subtitle="Столбец — доход за месяц; цвет — источник поступления">
          <Legend items={series} />
          {income.isLoading ? <PanelSkeleton /> : hasData ? (
            <BarChart labels={labels} series={series} mode="stacked" />
          ) : <EmptyState />}
        </Panel>

        <Panel title="Источники дохода" subtitle="Доля в общей сумме за период">
          {series.length === 0 && !income.isLoading && <EmptyState>Нет поступлений</EmptyState>}
          {series.map(s => (
            <div key={s.id} className="flex flex-col gap-[7px]">
              <div className="flex items-start justify-between gap-3">
                <span className="an-caption truncate" style={{ color: 'var(--an-text)' }}>{s.name}</span>
                <span className="an-caption">{formatPercent(share(s.total, total))}</span>
              </div>
              <span className="an-body tabular-nums" style={{ color: s.color }}>{formatCurrency(s.total)}</span>
              <ShareBar percent={share(s.total, total)} color={s.color} />
              <span className="an-caption">
                {s.count} {plural(s.count, 'поступление', 'поступления', 'поступлений')}
              </span>
            </div>
          ))}
        </Panel>
      </MainAsideRow>

      <MainAsideRow>
        <Panel title="Поступления по месяцам">
          {income.isLoading ? <PanelSkeleton height={240} /> : (
            <DataTable
              columns={['Месяц', ...series.map(s => s.name), 'Всего']}
              rows={keys.map((_, i) => [
                { value: labels[i] },
                ...series.map(s => ({ value: formatCurrency(s.values[i]) })),
                { value: formatCurrency(monthly[i]), color: CHART_COLORS.green, strong: true },
              ])}
            />
          )}
        </Panel>

        <Panel title="Что изменилось">
          {!hasData && <EmptyState>Нет поступлений за период</EmptyState>}
          {hasData && keys.length > 1 && (
            <InsightCard
              title={`${monthLongLabel(keys[keys.length - 1])}: ${first > 0 ? formatSignedPercent(share(last - first, first)) : formatSignedCurrency(last)} к ${monthDative(keys[0])}`}
            >
              Доход {last >= first ? 'вырос' : 'снизился'} с {formatCurrency(first)} до {formatCurrency(last)}.
              {growth && growth.delta !== 0 && ` Вклад «${growth.name}» ${growth.delta > 0 ? 'увеличился' : 'уменьшился'} на ${formatCurrency(Math.abs(growth.delta))}.`}
            </InsightCard>
          )}
          {hasData && main && (
            <InsightCard title={mainStable ? `«${main.name}» — стабильный источник` : `«${main.name}» — основной источник`}>
              {mainStable
                ? `${formatCurrency(mainValues[0])} каждый месяц. `
                : `От ${formatCurrency(Math.min(...mainValues))} до ${formatCurrency(Math.max(...mainValues))} в месяц. `}
              {series.length > 1
                ? `Остальные ${formatPercent(100 - share(main.total, total))} дохода приходятся на дополнительные источники.`
                : 'Других источников дохода за период нет.'}
            </InsightCard>
          )}
        </Panel>
      </MainAsideRow>
    </>
  )
}
