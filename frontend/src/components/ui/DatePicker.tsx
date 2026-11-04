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
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

/**
 * Parse user input: accepts DD.MM.YYYY, YYYY-MM-DD, or DDMMYYYY (continuous digits)
 * Returns ISO string or null if invalid
 */
function parseDateInput(val: string): string | null {
  // DD.MM.YYYY
  const dmy = val.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (dmy) {
    const [, day, month, year] = dmy
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (!isNaN(d.getTime())) return toISO(d.getFullYear(), d.getMonth(), d.getDate())
  }
  // YYYY-MM-DD
  const ymd = val.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (ymd) return val
  // DDMMYYYY (continuous digits, 8 chars)
  const raw = val.replace(/\D/g, '')
  if (raw.length === 8) {
    const d = new Date(parseInt(raw.slice(4, 8)), parseInt(raw.slice(2, 4)) - 1, parseInt(raw.slice(0, 2)))
    if (!isNaN(d.getTime())) return toISO(d.getFullYear(), d.getMonth(), d.getDate())
  }
  return null
}

/**
 * Format raw digits into DD.MM.YYYY with auto-inserting dots
 */
function formatRawInput(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`
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
  const [inputValue, setInputValue] = useState(formatDisplay(value))
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const today = todayISO()

  useEffect(() => {
    setInputValue(formatDisplay(value))
  }, [value])

  useEffect(() => {
    if (!open) return
    const handleDown = (e: MouseEvent) => {
      if (
        popupRef.current?.contains(e.target as Node) ||
        inputRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [open])

  const handleOpen = () => {
    if (!inputRef.current) return
    const r = inputRef.current.getBoundingClientRect()
    setPopupPos({ top: r.bottom + 6, left: r.left })
    const d = parseISO(value)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(formatRawInput(raw))

    // Try to parse when we have 8 digits
    const digits = raw.replace(/\D/g, '')
    if (digits.length === 8) {
      const parsed = parseDateInput(raw)
      if (parsed) {
        onChange(parsed)
      }
    }
  }

  const handleInputBlur = () => {
    // Try to parse what's there
    const parsed = parseDateInput(inputValue)
    if (parsed) {
      onChange(parsed)
      setInputValue(formatDisplay(parsed))
    } else {
      // Restore current value
      setInputValue(formatDisplay(value))
    }
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
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className="glass-input rounded-lg px-3 py-2.5 text-sm w-full text-left"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="ДД.ММ.ГГГГ"
        />
        <span
          ref={triggerRef}
          role="button"
          tabIndex={-1}
          onClick={handleOpen}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2.5" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
      </div>

      {open && createPortal(
        <div
          ref={popupRef}
          className="fixed z-[9999]"
          style={{
            top: popupPos.top,
            left: popupPos.left,
          }}
        >
          <div className="dark-card rounded-xl p-3 shadow-2xl" style={{ width: 280 }}>
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
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
