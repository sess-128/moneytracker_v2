import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { formatCurrency } from '@/utils/formatters'
import { chartScale } from '@/features/analytics/lib/chartScale'

export interface ChartSeries {
  id: string
  name: string
  color: string
  values: number[]
}

interface BaseChartProps {
  labels: string[]
  series: ChartSeries[]
  height?: number
}

/* ─── Геометрия (повторяет макет: 290px, сетка 25…251, ось Y до x=40) ─── */
const PAD_TOP = 25
const PAD_BOTTOM = 39
const PAD_LEFT = 52
const PAD_RIGHT = 24

const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(el)
    setWidth(Math.floor(el.getBoundingClientRect().width))
    return () => observer.disconnect()
  }, [])
  return { ref, width }
}

const tickFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

interface FrameProps extends BaseChartProps {
  max: number
  min: number
  children: (geo: Geometry) => ReactNode
}

interface Geometry {
  width: number
  plotWidth: number
  slot: number
  center: (i: number) => number
  y: (value: number) => number
  zeroY: number
}

const ChartFrame = ({ labels, series, height = 290, min, max, children }: FrameProps) => {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const inThousands = Math.max(Math.abs(min), Math.abs(max)) >= 10_000
  const divisor = inThousands ? 1000 : 1
  const { bottom, top, step } = chartScale(min / divisor, max / divisor)
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => bottom + i * step)

  const plotWidth = Math.max(0, width - PAD_LEFT - PAD_RIGHT)
  const plotHeight = height - PAD_TOP - PAD_BOTTOM
  const slot = labels.length ? plotWidth / labels.length : plotWidth
  const geo: Geometry = {
    width,
    plotWidth,
    slot,
    center: i => PAD_LEFT + slot * (i + 0.5),
    y: v => PAD_TOP + (top - v / divisor) / (top - bottom) * plotHeight,
    zeroY: PAD_TOP + top / (top - bottom) * plotHeight,
  }

  const tooltipLeft = hover !== null ? geo.center(hover) : 0
  const tooltipOnLeft = hover !== null && tooltipLeft > width / 2

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }} onMouseLeave={() => setHover(null)}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={series.map(s => s.name).join(', ')} className="block overflow-visible">
          <text x={0} y={10} className="an-caption2" fill="var(--an-text-2)">{inThousands ? 'тыс. ₽' : '₽'}</text>

          {ticks.map(t => {
            const y = geo.y(t * divisor)
            return (
              <g key={t}>
                <line x1={PAD_LEFT} x2={PAD_LEFT + plotWidth} y1={y + 0.5} y2={y + 0.5} stroke="var(--an-separator)" />
                <text x={40} y={y + 4} textAnchor="end" fontSize={11} fill="var(--an-text-2)">
                  {tickFormatter.format(t)}
                </text>
              </g>
            )
          })}

          {hover !== null && (
            <rect x={geo.center(hover) - slot / 2} y={PAD_TOP} width={slot} height={plotHeight} fill="var(--an-hover)" />
          )}

          {children(geo)}

          {labels.map((label, i) => (
            <text key={i} x={geo.center(i)} y={height - 13} textAnchor="middle" fontSize={12} fill="var(--an-text-2)">
              {label}
            </text>
          ))}

          {labels.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={geo.center(i) - slot / 2}
              y={PAD_TOP}
              width={slot}
              height={plotHeight + 30}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>
      )}

      {hover !== null && (
        <div
          className="absolute z-10 pointer-events-none an-inset px-3.5 py-3 flex flex-col gap-1.5 min-w-[180px] shadow-lg"
          style={{
            top: PAD_TOP,
            left: tooltipOnLeft ? undefined : tooltipLeft + slot / 2 + 4,
            right: tooltipOnLeft ? width - tooltipLeft + slot / 2 + 4 : undefined,
            border: '1px solid var(--an-separator)',
          }}
        >
          <p className="an-caption" style={{ color: 'var(--an-text)', fontWeight: 600 }}>{labels[hover]}</p>
          {series.map(s => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 an-caption">
                <span className="w-[7px] h-[7px] rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="an-caption tabular-nums" style={{ color: 'var(--an-text)' }}>
                {formatCurrency(s.values[hover] ?? 0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Столбцы: сгруппированные или накопительные ─────────────── */
interface BarChartProps extends BaseChartProps {
  mode?: 'grouped' | 'stacked'
  maxBarWidth?: number
}

export const BarChart = ({ labels, series, height, mode = 'grouped', maxBarWidth }: BarChartProps) => {
  const max = mode === 'stacked'
    ? Math.max(0, ...labels.map((_, i) => series.reduce((acc, s) => acc + Math.max(0, s.values[i] ?? 0), 0)))
    : Math.max(0, ...series.flatMap(s => s.values))
  const min = mode === 'stacked'
    ? Math.min(0, ...labels.map((_, i) => series.reduce((acc, s) => acc + Math.min(0, s.values[i] ?? 0), 0)))
    : Math.min(0, ...series.flatMap(s => s.values))

  return (
    <ChartFrame labels={labels} series={series} height={height} min={min} max={max}>
      {geo => {
        if (mode === 'stacked') {
          const barWidth = Math.min(maxBarWidth ?? 40, geo.slot * 0.6)
          return labels.map((_, i) => {
            let positive = 0
            let negative = 0
            return series.map(s => {
              const value = s.values[i] ?? 0
              if (value === 0) return null
              const start = value > 0 ? positive : negative
              const end = start + value
              if (value > 0) positive = end
              else negative = end
              const y0 = geo.y(start)
              const y1 = geo.y(end)
              return (
                <rect key={`${s.id}-${i}`} x={geo.center(i) - barWidth / 2} y={Math.min(y0, y1)} width={barWidth} height={Math.abs(y0 - y1)} fill={s.color} />
              )
            })
          })
        }

        const gap = 5
        const n = Math.max(1, series.length)
        const barWidth = Math.max(4, Math.min(maxBarWidth ?? 28, (geo.slot * 0.7 - gap * (n - 1)) / n))
        const groupWidth = barWidth * n + gap * (n - 1)
        return labels.map((_, i) =>
          series.map((s, j) => {
            const value = s.values[i] ?? 0
            if (value === 0) return null
            const y = geo.y(value)
            return (
              <rect
                key={`${s.id}-${i}`}
                x={geo.center(i) - groupWidth / 2 + j * (barWidth + gap)}
                y={Math.min(y, geo.zeroY)}
                width={barWidth}
                height={Math.abs(geo.zeroY - y)}
                rx={3}
                fill={s.color}
              />
            )
          }),
        )
      }}
    </ChartFrame>
  )
}

/* ─── Линии с точками ────────────────────────────────────────── */
export const LineChart = ({ labels, series, height }: BaseChartProps) => {
  const max = Math.max(0, ...series.flatMap(s => s.values))
  const min = Math.min(0, ...series.flatMap(s => s.values))

  return (
    <ChartFrame labels={labels} series={series} height={height} min={min} max={max}>
      {geo =>
        series.map(s => {
          const points = s.values.map((v, i) => [geo.center(i), geo.y(v)] as const)
          return (
            <g key={s.id}>
              <polyline
                points={points.map(p => p.join(',')).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.75} fill={s.color} />)}
            </g>
          )
        })
      }
    </ChartFrame>
  )
}
