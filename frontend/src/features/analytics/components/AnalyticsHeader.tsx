import { useEffect, useRef, useState } from 'react'
import chevronDown from '@/assets/analytics/chevron-down.svg'
import { DatePicker } from '@/features/analytics/components/DatePicker'
import {
  PERIOD_PRESETS,
  formatPeriodRange,
  type Period,
  type PeriodPreset,
} from '@/features/analytics/lib/period'

export type AnalyticsTab = 'overview' | 'income' | 'expenses' | 'savings'

export const ANALYTICS_TABS: Array<{ id: AnalyticsTab; label: string }> = [
  { id: 'overview', label: 'Обзор' },
  { id: 'income', label: 'Доходы' },
  { id: 'expenses', label: 'Расходы' },
  { id: 'savings', label: 'Накопления' },
]

/* ─── Выбор пресета периода ─────────────────────────────────── */
const PresetSelect = ({ preset, onChange }: { preset: PeriodPreset; onChange: (p: PeriodPreset) => void }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const label = PERIOD_PRESETS.find(p => p.id === preset)?.label ?? 'Свой период'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="an-control"
        style={{ background: 'var(--an-chip)' }}
      >
        <span className="an-body">{label}</span>
        <img src={chevronDown} alt="" width={16} height={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 min-w-[180px] an-inset p-1 shadow-xl"
          style={{ border: '1px solid var(--an-separator)' }}
        >
          {PERIOD_PRESETS.map(p => (
            <li key={p.id}>
              <button
                type="button"
                role="option"
                aria-selected={p.id === preset}
                onClick={() => {
                  onChange(p.id)
                  setOpen(false)
                }}
                className="w-full text-left rounded-md px-3 py-2 text-[12px] leading-4 transition-colors hover:bg-[var(--an-hover)]"
                style={{ color: p.id === preset ? 'var(--an-chip-border)' : 'var(--an-text)' }}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ─── Заголовок страницы и период ───────────────────────────── */
interface AnalyticsHeaderProps {
  period: Period
  preset: PeriodPreset
  onPresetChange: (p: PeriodPreset) => void
  onPeriodChange: (p: Period) => void
}

export const AnalyticsHeader = ({ period, preset, onPresetChange, onPeriodChange }: AnalyticsHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-col gap-[5px] min-w-0">
      <h1 className="an-title1">Финансовая аналитика</h1>
      <p className="an-caption">{formatPeriodRange(period)} · Все счета · ₽</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <PresetSelect preset={preset} onChange={onPresetChange} />
      <DatePicker
        label="Начало периода"
        value={period.start}
        max={period.end}
        rangeStart={period.start}
        rangeEnd={period.end}
        onChange={start => onPeriodChange({ ...period, start })}
      />
      <DatePicker
        label="Конец периода"
        value={period.end}
        min={period.start}
        rangeStart={period.start}
        rangeEnd={period.end}
        onChange={end => onPeriodChange({ ...period, end })}
      />
    </div>
  </div>
)

/* ─── Вкладки аналитики (segmented control) ─────────────────── */
export const AnalyticsTabs = ({ value, onChange }: { value: AnalyticsTab; onChange: (t: AnalyticsTab) => void }) => (
  <div role="tablist" aria-label="Разделы аналитики" className="inline-flex items-center rounded-full p-[2px] w-full sm:w-[480px] max-w-full overflow-x-auto" style={{ background: 'var(--an-segment)' }}>
    {ANALYTICS_TABS.map(tab => {
      const active = tab.id === value
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(tab.id)}
          className="an-tab flex-1 h-8 rounded-full px-3 text-[12px] leading-4 whitespace-nowrap transition-colors"
          style={{
            background: active ? 'var(--an-chip)' : 'transparent',
            border: `1px solid ${active ? 'var(--an-chip-border)' : 'transparent'}`,
            color: active ? 'var(--an-text)' : 'var(--an-text-2)',
            fontWeight: 400,
          }}
        >
          {tab.label}
        </button>
      )
    })}
  </div>
)
