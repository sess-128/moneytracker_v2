export type PeriodPreset = 'month' | 'quarter' | 'halfYear' | 'year' | 'custom'

export interface Period {
  /** ISO yyyy-MM-dd, включительно */
  start: string
  /** ISO yyyy-MM-dd, включительно */
  end: string
}

export const PERIOD_PRESETS: Array<{ id: Exclude<PeriodPreset, 'custom'>; label: string; months: number; totalLabel: string }> = [
  { id: 'month', label: 'Месяц', months: 1, totalLabel: 'За месяц' },
  { id: 'quarter', label: '3 месяца', months: 3, totalLabel: 'За 3 месяца' },
  { id: 'halfYear', label: 'Полгода', months: 6, totalLabel: 'За полгода' },
  { id: 'year', label: 'Год', months: 12, totalLabel: 'За год' },
]

const MONTHS_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
const MONTHS_NOMINATIVE = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const MONTHS_PREPOSITIONAL = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре']
const MONTHS_DATIVE = ['январю', 'февралю', 'марту', 'апрелю', 'маю', 'июню', 'июлю', 'августу', 'сентябрю', 'октябрю', 'ноябрю', 'декабрю']

const pad = (n: number) => String(n).padStart(2, '0')

/** Локальная дата → yyyy-MM-dd (без сдвига часового пояса, в отличие от toISOString) */
export const toLocalISO = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (iso: string, days: number): string => {
  const d = parseISODate(iso)
  d.setDate(d.getDate() + days)
  return toLocalISO(d)
}

/** N месяцев, включая текущий: с 1-го числа (N-1) месяцев назад по сегодня */
export const presetPeriod = (months: number, today = new Date()): Period => ({
  start: toLocalISO(new Date(today.getFullYear(), today.getMonth() - months + 1, 1)),
  end: toLocalISO(today),
})

/** Ключи месяцев yyyy-MM от начала до конца периода */
export const monthKeys = ({ start, end }: Period): string[] => {
  const keys: string[] = []
  const cursor = parseISODate(start)
  cursor.setDate(1)
  const last = parseISODate(end)
  while (cursor <= last && keys.length < 240) {
    keys.push(`${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}`)
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return keys
}

const monthIndex = (key: string) => Number(key.slice(5, 7)) - 1

export const monthShortLabel = (key: string, withYear = false): string =>
  withYear ? `${MONTHS_SHORT[monthIndex(key)]} ${key.slice(2, 4)}` : MONTHS_SHORT[monthIndex(key)]

export const monthLongLabel = (key: string): string => MONTHS_NOMINATIVE[monthIndex(key)]
export const monthPrepositional = (key: string): string => MONTHS_PREPOSITIONAL[monthIndex(key)]
export const monthDative = (key: string): string => MONTHS_DATIVE[monthIndex(key)]

/** «1 апреля», «30 сентября 2026» */
export const formatDayMonth = (iso: string, withYear = false): string => {
  const d = parseISODate(iso)
  const base = `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]}`
  return withYear ? `${base} ${d.getFullYear()}` : base
}

/** «1 апр» — короткая подпись точки на оси */
export const formatDayMonthShort = (iso: string): string => {
  const d = parseISODate(iso)
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()].toLowerCase()}`
}

/** «1 апреля — 30 сентября 2026» */
export const formatPeriodRange = ({ start, end }: Period): string => {
  const s = parseISODate(start)
  const e = parseISODate(end)
  const sameYear = s.getFullYear() === e.getFullYear()
  return `${formatDayMonth(start, !sameYear)} — ${formatDayMonth(end, true)}`
}

export const plural = (n: number, one: string, few: string, many: string): string => {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last > 1 && last < 5) return few
  if (last === 1) return one
  return many
}
