import { useId, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useMonthlyCategoryAmounts } from '../hooks/useMonthlyCategoryAmounts'

const formatAmount = (amount: number) => new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2,
}).format(amount)

const COLORS = [
  '#3095af', '#309a76', '#e58a23', '#e13d36',
  '#8b5de5', '#3874df', '#ca3c80', '#248599',
  '#047857', '#b45309', '#be185d', '#b91c1c',
]

export const MonthlyExpenses = () => {
  const [expanded, setExpanded] = useState(false)
  const categoryListId = useId()
  const { categories, isLoading, isError, retry } = useMonthlyCategoryAmounts()

  const total = categories.reduce((sum, category) => sum + category.amount, 0)
  const SIZE = 250
  const R = 102
  const CX = SIZE / 2
  const CY = SIZE / 2
  const STROKE = 28
  const CIRCUMFERENCE = 2 * Math.PI * R
  const GAP = 4

  const slices = categories
    .map((category, index) => ({ ...category, color: COLORS[index % COLORS.length] }))

  // Signed amounts remain visible; arc lengths use magnitudes because a circle has no negative area.
  const chartTotal = slices.reduce((sum, slice) => sum + Math.abs(slice.amount), 0)
  let accumulated = 0
  const arcs = slices.filter(slice => slice.amount !== 0).map(slice => {
    const length = Math.abs(slice.amount) / chartTotal * CIRCUMFERENCE
    const dash = Math.max(0, length - (slices.length > 1 ? Math.min(GAP, length * 0.1) : 0))
    const arc = { ...slice, dash, offset: accumulated }
    accumulated += length
    return arc
  })

  return (
    <GlassCard padding="lg" className="category-card flex flex-col min-w-0">
      <h2 className="an-title1">По категориям</h2>
      <p className="an-caption mt-1 mb-5">Суммы по родительским категориям за текущий месяц</p>

      {isError ? <div role="alert" className="history-status"><p>Не удалось загрузить суммы за месяц.</p><button type="button" className="action-primary mt-3" onClick={retry}>Повторить</button></div> : isLoading ? <p role="status" className="history-status">Загрузка сумм за месяц…</p> : categories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-300 dark:text-white/25 text-sm">За текущий месяц операций нет</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center gap-5 min-h-0">
          <svg role="img" aria-label="Суммы транзакций по родительским категориям" width={SIZE} height={SIZE} className="flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="var(--an-track)"
              strokeWidth={STROKE}
            />
            {arcs.map((arc) => (
              <circle
                key={arc.id}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeDasharray={`${arc.dash} ${CIRCUMFERENCE - arc.dash}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="butt"
              ><title>{arc.name}: {formatAmount(arc.amount)}</title></circle>
            ))}
            <text
              x={CX} y={CY - 12}
              textAnchor="middle"
              fill="var(--an-text)"
              fontSize="12"
              fontWeight="400"
              style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}
            >
              {formatAmount(total)}
            </text>
            <text
              x={CX} y={CY + 16}
              textAnchor="middle"
              fill="var(--an-text-2)"
              fontSize="12"
              style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}
            >
              За месяц
            </text>
          </svg>

          <div className="w-full flex flex-col">
            <div className="an-caption flex justify-between pb-5 mb-5 border-b" style={{ borderColor: 'var(--an-separator)' }}><span>Категория</span><span>Сумма</span></div>
            <div id={categoryListId}>
            {(expanded ? slices : slices.slice(0, 10)).map((slice) => (
              <div key={slice.id} className="flex items-center gap-2.5 min-h-[35px]">
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: slice.color }}
                />
                <span className="an-body truncate flex-1">{slice.name}</span>
                <span className="an-caption tabular-nums flex-shrink-0">
                  {formatAmount(slice.amount)}
                </span>
              </div>
            ))}
            </div>
            {slices.length > 10 && (
              <button
                type="button"
                className="pagination-button mt-4 w-full"
                aria-expanded={expanded}
                aria-controls={categoryListId}
                onClick={() => setExpanded(value => !value)}
              >
                {expanded ? 'Свернуть' : `Показать ещё (${slices.length - 10})`}
              </button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  )
}
