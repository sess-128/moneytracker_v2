import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
]
const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function todayISO(): string {
  const t = new Date()
  return toISO(t.getFullYear(), t.getMonth(), t.getDate())
}

function firstWeekdayOfMonth(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function formatDisplay(iso: string): string {
  const d = parseISO(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

interface DatePickerProps {
  value: string
  onChange: (v: string) => void
  label?: string
}

export const DatePicker = ({ value, onChange, label }: DatePickerProps) => {
  const parsed = parseISO(value)
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(parsed.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed.getMonth())
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const today = todayISO()

  useEffect(() => {
    if (!open) return
    const handleDown = (e: MouseEvent) => {
      if (
        popupRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [open])

  const handleOpen = () => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPopupPos({ top: r.bottom + 6, left: r.left, width: r.width })
    const d = parseISO(value)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setOpen(true)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const offset = firstWeekdayOfMonth(viewYear, viewMonth)
  const total = daysInMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="glass-input rounded-lg px-3 py-2.5 text-sm w-full text-left flex items-center justify-between gap-2"
      >
        <span className="text-white">{formatDisplay(value)}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.7" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2.5" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && createPortal(
        <div
          ref={popupRef}
          style={{
            position: 'fixed',
            top: popupPos.top,
            left: popupPos.left,
            width: Math.max(popupPos.width, 248),
            zIndex: 9999,
          }}
          className="dark-card rounded-xl p-3 shadow-2xl"
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-white text-sm font-medium">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const iso = toISO(viewYear, viewMonth, day)
              const isSelected = iso === value
              const isToday = iso === today
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { onChange(iso); setOpen(false) }}
                  className={[
                    'text-xs rounded-lg py-1.5 transition-all duration-100 font-medium',
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : isToday
                      ? 'text-purple-300 bg-purple-500/20 hover:bg-purple-500/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
