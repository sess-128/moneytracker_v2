import { GlassCard } from '@/components/ui/GlassCard'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { useCategories } from '@/features/categories/hooks/useCategories'

const COLORS = [
  '#7c3aed', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#db2777', '#dc2626', '#0e7490',
  '#047857', '#b45309', '#be185d', '#b91c1c',
]

export const MonthlyExpenses = () => {
  const { data: transactions = [] } = useTransactions()
  const { data: categories = [] } = useCategories()

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))

  const countMap = new Map<string, number>()
  for (const tx of transactions) {
    countMap.set(tx.categoryId, (countMap.get(tx.categoryId) ?? 0) + 1)
  }

  const total = transactions.length

  const SIZE = 270
  const R = 98
  const CX = SIZE / 2
  const CY = SIZE / 2
  const STROKE = 34
  const CIRCUMFERENCE = 2 * Math.PI * R
  const GAP = 4
  const MIN_ARC = GAP + 2

  const rawSlices = [...countMap.entries()]
    .map(([id, count], i) => ({
      id,
      name: categoryMap.get(id) ?? id.slice(0, 8),
      count,
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.count - a.count)

  // Merge tiny segments into "Другое" so they don't create invisible dead zones
  const { visible, otherCount } = rawSlices.reduce<{
    visible: typeof rawSlices
    otherCount: number
  }>(
    (acc, slice) => {
      const arcLen = (slice.count / total) * CIRCUMFERENCE
      if (arcLen >= MIN_ARC) {
        acc.visible.push(slice)
      } else {
        acc.otherCount += slice.count
      }
      return acc
    },
    { visible: [], otherCount: 0 },
  )

  const slices = [
    ...visible,
    ...(otherCount > 0
      ? [{ id: '__other__', name: 'Другое', count: otherCount, color: '#475569' }]
      : []),
  ]

  const effectiveTotal = slices.reduce((s, sl) => s + sl.count, 0)

  let accumulated = 0
  const arcs = slices.map((slice, i) => {
    const pct = slice.count / effectiveTotal
    const isLast = i === slices.length - 1
    // Last segment gets no gap to avoid floating-point remainder showing as empty
    const dash = isLast
      ? CIRCUMFERENCE - accumulated
      : Math.max(MIN_ARC, pct * CIRCUMFERENCE - GAP)
    const arc = { ...slice, dash, offset: accumulated }
    accumulated += isLast ? CIRCUMFERENCE - accumulated : pct * CIRCUMFERENCE
    return arc
  })

  return (
    <GlassCard padding="md" className="flex flex-col flex-1 min-h-0">
      <p className="text-white/55 text-sm mb-3 flex-shrink-0">По категориям:</p>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/25 text-sm">Нет транзакций</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center gap-4 min-h-0 overflow-hidden">
          <svg width={SIZE} height={SIZE} className="flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
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
              />
            ))}
            <text
              x={CX} y={CY - 12}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="34"
              fontWeight="700"
              style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}
            >
              {total}
            </text>
            <text
              x={CX} y={CY + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)"
              fontSize="12"
              style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}
            >
              транзакций
            </text>
          </svg>

          <div className="w-full flex flex-col gap-1.5 overflow-y-auto min-h-0">
            {slices.map((slice) => (
              <div key={slice.id} className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: slice.color }}
                />
                <span className="text-white/65 text-xs truncate flex-1">{slice.name}</span>
                <span className="text-white/35 text-xs tabular-nums flex-shrink-0">
                  {slice.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  )
}
