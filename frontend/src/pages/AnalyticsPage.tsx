import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ANALYTICS_TABS,
  AnalyticsHeader,
  AnalyticsTabs,
  type AnalyticsTab,
} from '@/features/analytics/components/AnalyticsHeader'
import { AccountingNote } from '@/features/analytics/components/AnalyticsBlocks'
import { OverviewTab } from '@/features/analytics/components/tabs/OverviewTab'
import { IncomeTab } from '@/features/analytics/components/tabs/IncomeTab'
import { ExpensesTab } from '@/features/analytics/components/tabs/ExpensesTab'
import { SavingsTab } from '@/features/analytics/components/tabs/SavingsTab'
import type { TabProps } from '@/features/analytics/components/tabs/types'
import {
  PERIOD_PRESETS,
  monthKeys,
  monthShortLabel,
  plural,
  presetPeriod,
  parseISODate,
  toLocalISO,
  type Period,
  type PeriodPreset,
} from '@/features/analytics/lib/period'

const DEFAULT_PRESET = 'halfYear' as const
const defaultMonths = PERIOD_PRESETS.find(p => p.id === DEFAULT_PRESET)!.months
const PERIOD_STORAGE_KEY = 'analytics-period'

interface PeriodSelection {
  preset: PeriodPreset
  period: Period
}

const isSavedPeriod = (value: unknown): value is Period => {
  if (!value || typeof value !== 'object' || !('start' in value) || !('end' in value)) return false
  const validDate = (date: unknown): date is string =>
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && toLocalISO(parseISODate(date)) === date
  return validDate(value.start) && validDate(value.end) && value.start <= value.end
}

const restorePeriod = (): PeriodSelection => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(PERIOD_STORAGE_KEY) ?? 'null')
    if (saved && typeof saved === 'object' && 'preset' in saved) {
      const config = PERIOD_PRESETS.find(p => p.id === saved.preset)
      // Пресеты остаются относительными: «Год» заканчивается сегодняшним днём.
      if (config) return { preset: config.id, period: presetPeriod(config.months) }
      if (saved.preset === 'custom' && 'period' in saved && isSavedPeriod(saved.period)) {
        return { preset: 'custom', period: saved.period }
      }
    }
  } catch { /* Недоступное хранилище или повреждённое значение не мешают открыть аналитику. */ }
  return { preset: DEFAULT_PRESET, period: presetPeriod(defaultMonths) }
}

const isTab = (v: string | null): v is AnalyticsTab => ANALYTICS_TABS.some(t => t.id === v)

const TAB_COMPONENTS: Record<AnalyticsTab, (props: TabProps) => JSX.Element> = {
  overview: OverviewTab,
  income: IncomeTab,
  expenses: ExpensesTab,
  savings: SavingsTab,
}

export const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: AnalyticsTab = isTab(tabParam) ? tabParam : 'overview'

  const [{ preset, period }, setPeriodSelection] = useState<PeriodSelection>(restorePeriod)

  useEffect(() => {
    try {
      localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify({ preset, period }))
    } catch { /* Выбор продолжает работать в памяти, если браузер запрещает сохранение. */ }
  }, [preset, period])

  const keys = useMemo(() => monthKeys(period), [period])
  const labels = useMemo(() => {
    const multiYear = keys.length > 0 && keys[0].slice(0, 4) !== keys[keys.length - 1].slice(0, 4)
    return keys.map(k => monthShortLabel(k, multiYear))
  }, [keys])

  const totalLabel = PERIOD_PRESETS.find(p => p.id === preset)?.totalLabel ?? 'За период'

  const handlePresetChange = (next: PeriodPreset) => {
    const config = PERIOD_PRESETS.find(p => p.id === next)
    if (config) setPeriodSelection({ preset: config.id, period: presetPeriod(config.months) })
  }

  const handlePeriodChange = (next: Period) => {
    if (next.start > next.end) return
    setPeriodSelection({ preset: 'custom', period: next })
  }

  const handleTabChange = (next: AnalyticsTab) =>
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      if (next === 'overview') params.delete('tab')
      else params.set('tab', next)
      return params
    }, { replace: true })

  const ActiveTab = TAB_COMPONENTS[tab]

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-2">
      <div className="flex flex-col gap-6 pb-6 pt-10">
        <AnalyticsHeader
          period={period}
          preset={preset}
          onPresetChange={handlePresetChange}
          onPeriodChange={handlePeriodChange}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <AnalyticsTabs value={tab} onChange={handleTabChange} />
          <p className="an-caption">
            {keys.length} {plural(keys.length, 'месяц', 'месяца', 'месяцев')} в периоде
          </p>
        </div>

        <ActiveTab period={period} keys={keys} labels={labels} totalLabel={totalLabel} />

        <AccountingNote />
      </div>
    </div>
  )
}
