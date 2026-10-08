import { useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getCurrentMonthRange, toISODate } from '@/utils/formatters'
import type { AnalyticsFilterRequest } from '@/types/api.types'

interface DateFiltersProps {
  onSearchClick: (params: AnalyticsFilterRequest) => void
}

export const DateFilters = ({ onSearchClick }: DateFiltersProps) => {
  const now = new Date()
  const defaultStart = toISODate(new Date(now.getFullYear(), now.getMonth() - 5, 1))
  const defaultEnd = toISODate(now)

  const [from, setFrom] = useState(defaultStart)
  const [to, setTo] = useState(defaultEnd)
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const handleSearch = () => {
    onSearchClick({
      startDate: from,
      endDate: to,
      categoryIds: [],
      minAmount: parseFloat(min) || 0,
      maxAmount: max ? parseFloat(max) : undefined,
    })
  }

  const handleCurrentMonth = () => {
    const range = getCurrentMonthRange()
    setFrom(range.startDate)
    setTo(range.endDate)
    onSearchClick({
      startDate: range.startDate,
      endDate: range.endDate,
      categoryIds: [],
      minAmount: parseFloat(min) || 0,
      maxAmount: max ? parseFloat(max) : undefined,
    })
  }

  const handleLastMonth = () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const start = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)
    const end = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
    const startISO = toISODate(start)
    const endISO = toISODate(end)
    setFrom(startISO)
    setTo(endISO)
    onSearchClick({
      startDate: startISO,
      endDate: endISO,
      categoryIds: [],
      minAmount: parseFloat(min) || 0,
      maxAmount: max ? parseFloat(max) : undefined,
    })
  }

  const handleHalfYear = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const startISO = toISODate(start)
    const endISO = toISODate(now)
    setFrom(startISO)
    setTo(endISO)
    onSearchClick({
      startDate: startISO,
      endDate: endISO,
      categoryIds: [],
      minAmount: parseFloat(min) || 0,
      maxAmount: max ? parseFloat(max) : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">От:</span>
          <DatePicker value={from} onChange={setFrom} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">До:</span>
          <DatePicker value={to} onChange={setTo} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">От:</span>
          <Input
            type="number"
            placeholder="0"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">До:</span>
          <Input
            type="number"
            placeholder="∞"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-24"
          />
        </div>

        <Button onClick={handleSearch} size="md" className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-6">
          Найти
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={handleCurrentMonth}>
          Текущий месяц
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLastMonth}>
          Прошлый месяц
        </Button>
        <Button variant="ghost" size="sm" onClick={handleHalfYear}>
          Полгода
        </Button>
      </div>
    </div>
  )
}
