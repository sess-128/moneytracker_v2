import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import chevronDown from '@/assets/analytics/chevron-down.svg'
import { addDays, formatDayMonth, parseISODate, toLocalISO } from '@/features/analytics/lib/period'

interface DatePickerProps {
  value: string
  min?: string
  max?: string
  label: string
  rangeStart: string
  rangeEnd: string
  onChange: (value: string) => void
}

const dateLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
const monthLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long' })
const months = Array.from({ length: 12 }, (_, i) => monthLabel.format(new Date(2026, i, 1)))
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const dayOffsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
type View = 'days' | 'months' | 'years'

/** Календарь в портале: не обрезается прокруткой страницы и краями экрана. */
export const DatePicker = ({ value, min, max, label, rangeStart, rangeEnd, onChange }: DatePickerProps) => {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('days')
  const [cursor, setCursor] = useState(value)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const date = parseISODate(cursor)
  const year = date.getFullYear()
  const month = date.getMonth()
  const yearStart = Math.floor(year / 12) * 12
  const today = toLocalISO(new Date())
  const allowed = (iso: string) => (!min || iso >= min) && (!max || iso <= max)
  const overlaps = (start: string, end: string) => (!min || end >= min) && (!max || start <= max)
  const monthAllowed = (y: number, m: number) => overlaps(toLocalISO(new Date(y, m, 1)), toLocalISO(new Date(y, m + 1, 0)))

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }
  const select = (iso: string) => {
    if (!allowed(iso)) return
    onChange(iso)
    close()
  }

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      if (!trigger.current || !popup.current) return
      const anchor = trigger.current.getBoundingClientRect()
      const panel = popup.current.getBoundingClientRect()
      const margin = 12
      const below = anchor.bottom + 8
      const top = below + panel.height <= window.innerHeight - margin
        ? below
        : Math.max(margin, anchor.top - panel.height - 8)
      setPosition({ top, left: Math.max(margin, Math.min(anchor.right - panel.width, window.innerWidth - panel.width - margin)) })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, view])

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  useEffect(() => {
    if (open) popup.current?.querySelector<HTMLButtonElement>('[data-calendar-focus]')?.focus()
  }, [open, view, cursor])

  const shift = (direction: number) => {
    const next = view === 'days'
      ? new Date(year, month + direction, 1)
      : new Date(year + direction * (view === 'years' ? 12 : 1), month, 1)
    const iso = toLocalISO(next)
    setCursor(min && iso < min ? min : max && iso > max ? max : iso)
  }
  const canShift = (direction: number) => {
    if (view === 'days') return monthAllowed(year, month + direction)
    const start = view === 'years' ? yearStart + direction * 12 : year + direction
    const end = view === 'years' ? start + 11 : start
    return overlaps(`${start}-01-01`, `${end}-12-31`)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
    }
    if (event.key === 'Tab') {
      const buttons = Array.from(popup.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    if (view !== 'days' || !(event.target as HTMLElement).hasAttribute('data-calendar-day')) return
    const offset = dayOffsets[event.key]
    if (offset !== undefined) {
      event.preventDefault()
      const next = addDays(cursor, offset)
      if (allowed(next)) setCursor(next)
    }
  }

  const firstDay = new Date(year, month, 1)
  const firstCell = new Date(year, month, 1 - (firstDay.getDay() + 6) % 7)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label={`${label}: ${formatDayMonth(value, true)}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          if (open) { close(); return }
          setCursor(value)
          setView('days')
          setPosition(null)
          setOpen(true)
        }}
        className="an-control"
        style={{ background: 'var(--an-segment)' }}
      >
        <span className="whitespace-nowrap">{dateLabel.format(parseISODate(value))}</span>
        <img src={chevronDown} alt="" width={16} height={16} className={open ? 'rotate-180' : ''} />
      </button>
      {open && createPortal(
        <div
          id={id}
          ref={popup}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="an-calendar fixed z-50 w-[280px] max-w-[calc(100vw-24px)] rounded-[14px] border p-3 shadow-xl"
          style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? 'visible' : 'hidden', maxHeight: 'calc(100dvh - 24px)', overflowY: 'auto' }}
        >
          <p className="an-caption px-1 pb-2">{label}</p>
          <div className="mb-3 flex items-center justify-between gap-1">
            <button type="button" className="an-calendar-nav" aria-label="Назад" disabled={!canShift(-1)} onClick={() => shift(-1)}>
              <img src={chevronDown} alt="" width={16} height={16} className="rotate-90" />
            </button>
            <div className="flex items-center gap-1">
              <button type="button" className="an-calendar-heading capitalize" onClick={() => setView(view === 'months' ? 'days' : 'months')}>{months[month]}</button>
              <button type="button" className="an-calendar-heading" onClick={() => setView(view === 'years' ? 'days' : 'years')}>{view === 'years' ? `${yearStart}–${yearStart + 11}` : year}</button>
            </div>
            <button type="button" className="an-calendar-nav" aria-label="Вперёд" disabled={!canShift(1)} onClick={() => shift(1)}>
              <img src={chevronDown} alt="" width={16} height={16} className="-rotate-90" />
            </button>
          </div>
          {view === 'days' ? (
            <>
              <div className="grid grid-cols-7 pb-1" aria-hidden="true">
                {weekdays.map(day => <span key={day} className="an-caption2 py-1 text-center">{day}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-y-1" role="group" aria-label={`${months[month]} ${year}`}>
                {Array.from({ length: 42 }, (_, i) => {
                  const day = new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i)
                  const iso = toLocalISO(day)
                  const selected = iso === value
                  const inRange = iso >= rangeStart && iso <= rangeEnd
                  return (
                    <button
                      key={iso}
                      type="button"
                      data-calendar-day
                      data-calendar-focus={iso === cursor ? '' : undefined}
                      tabIndex={iso === cursor ? 0 : -1}
                      aria-label={formatDayMonth(iso, true)}
                      aria-pressed={selected}
                      aria-current={iso === today ? 'date' : undefined}
                      disabled={!allowed(iso)}
                      onClick={() => select(iso)}
                      className="an-calendar-day"
                      style={{
                        color: day.getMonth() === month ? 'var(--an-text)' : 'var(--an-text-2)',
                        background: selected || inRange ? 'var(--an-chip)' : undefined,
                        borderColor: selected ? 'var(--an-chip-border)' : iso === today ? 'var(--an-separator)' : 'transparent',
                      }}
                    >{day.getDate()}</button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, i) => {
                const chosen = view === 'months' ? i === month : yearStart + i === year
                const y = view === 'years' ? yearStart + i : year
                const m = view === 'months' ? i : month
                const enabled = view === 'months' ? monthAllowed(y, m) : overlaps(`${y}-01-01`, `${y}-12-31`)
                return (
                  <button
                    key={i}
                    type="button"
                    data-calendar-focus={chosen ? '' : undefined}
                    aria-pressed={chosen}
                    disabled={!enabled}
                    className="an-calendar-heading capitalize py-3"
                    style={chosen ? { background: 'var(--an-chip)', color: 'var(--an-chip-border)' } : undefined}
                    onClick={() => {
                      const next = toLocalISO(new Date(y, m, 1))
                      setCursor(min && next < min ? min : max && next > max ? max : next)
                      setView(view === 'years' ? 'months' : 'days')
                    }}
                  >{view === 'months' ? months[i] : y}</button>
                )
              })}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t pt-2" style={{ borderColor: 'var(--an-separator)' }}>
            <button type="button" className="an-calendar-heading" disabled={!allowed(today)} onClick={() => select(today)}>Сегодня</button>
            <button type="button" className="an-calendar-heading" onClick={close}>Закрыть</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
