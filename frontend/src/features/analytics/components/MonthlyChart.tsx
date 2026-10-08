import { useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'
import type { TransactionResponse } from '@/types/api.types'

interface MonthlyChartProps {
  transactions: TransactionResponse[]
}

interface MonthlyData {
  income: number
  expense: number
}

type MonthlyMap = Map<string, MonthlyData>

const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  const chartData = useMemo<MonthlyData[]>(() => {
    const monthlyMap: MonthlyMap = new Map()

    for (const tx of transactions) {
      if (!tx.transactionDate) continue
      const d = new Date(tx.transactionDate)
      const monthIndex = d.getMonth()
      const year = d.getFullYear()
      const sortKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`

      if (!monthlyMap.has(sortKey)) {
        monthlyMap.set(sortKey, { income: 0, expense: 0 })
      }

      const entry = monthlyMap.get(sortKey)!
      const amount = tx.amount

      if (tx.type === 'INCOME') {
        entry.income += amount
      } else {
        entry.expense += amount
      }
    }

    return [...monthlyMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, data]) => data)
  }, [transactions])

  if (chartData.length === 0) {
    return (
      <GlassCard padding="lg">
        <div className="flex flex-col gap-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-medium">ДИНАМИКА</p>
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-white/25 text-sm">Нет данных для графика</p>
          </div>
        </div>
      </GlassCard>
    )
  }

  const WIDTH = 500
  const HEIGHT = 260
  const PAD_LEFT = 60
  const PAD_BOTTOM = 40
  const PAD_TOP = 20
  const PAD_RIGHT = 20

  const chartW = WIDTH - PAD_LEFT - PAD_RIGHT
  const chartH = HEIGHT - PAD_TOP - PAD_BOTTOM

  const allValues = chartData.flatMap(d => [d.income, d.expense, d.income - d.expense])
  const maxVal = Math.max(...allValues, 1)
  const minVal = Math.min(...allValues, 0)
  const range = maxVal - minVal || 1

  const getX = (i: number) => PAD_LEFT + (i / Math.max(chartData.length - 1, 1)) * chartW
  const getY = (val: number) => PAD_TOP + chartH - ((val - minVal) / range) * chartH

  const gridLines = 4
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => minVal + (range * i) / gridLines)

  return (
    <GlassCard padding="lg">
      <div className="flex flex-col gap-4">
        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">ДИНАМИКА</p>

        <div className="flex-1 min-h-0">
          <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="overflow-visible">
            {/* Grid */}
            {gridValues.map((val, i) => (
              <g key={i}>
                <line
                  x1={PAD_LEFT}
                  y1={getY(val)}
                  x2={WIDTH - PAD_RIGHT}
                  y2={getY(val)}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <text
                  x={PAD_LEFT - 8}
                  y={getY(val) + 4}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.2)"
                  fontSize="10"
                >
                  {Math.round(val).toLocaleString('ru-RU')}
                </text>
              </g>
            ))}

            {/* X axis labels */}
            {chartData.map((_, i) => (
              <text
                key={i}
                x={getX(i)}
                y={HEIGHT - 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="10"
              >
                {MONTHS_RU[i % 12]}
              </text>
            ))}

            {/* Lines */}
            <AnimatePresence>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {/* Expense line */}
                <polyline
                  points={chartData.map((d, i) => `${getX(i)},${getY(d.expense)}`).join(' ')}
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2"
                />

                {/* Income line */}
                <polyline
                  points={chartData.map((d, i) => `${getX(i)},${getY(d.income)}`).join(' ')}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                />

                {/* Balance line */}
                <polyline
                  points={chartData.map((d, i) => `${getX(i)},${getY(d.income - d.expense)}`).join(' ')}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                />

                {/* Dots */}
                {chartData.map((d, i) => (
                  <g key={i}>
                    <circle cx={getX(i)} cy={getY(d.expense)} r="3" fill="#fb7185" />
                    <circle cx={getX(i)} cy={getY(d.income)} r="3" fill="#34d399" />
                    <circle cx={getX(i)} cy={getY(d.income - d.expense)} r="3" fill="#7c3aed" />
                  </g>
                ))}
              </motion.g>
            </AnimatePresence>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span className="text-white/50 text-xs">Доход</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
            <span className="text-white/50 text-xs">Расход</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            <span className="text-white/50 text-xs">Баланс</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
