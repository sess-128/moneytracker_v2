import type { ReactNode } from 'react'
import infoIcon from '@/assets/analytics/info.svg'

/* ─── Показатель (карточка сводки) ───────────────────────────── */
interface MetricCardProps {
  label: string
  value: string
  hint?: ReactNode
  color?: string
}

export const MetricCard = ({ label, value, hint, color }: MetricCardProps) => (
  <div className="an-card flex flex-col gap-2 p-5 min-w-0">
    <p className="an-caption truncate">{label}</p>
    <p className="an-title1 truncate tabular-nums" style={color ? { color } : undefined}>{value}</p>
    {hint && <div className="an-caption">{hint}</div>}
  </div>
)

export const MetricGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
)

/* ─── Блок аналитики ─────────────────────────────────────────── */
interface PanelProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export const Panel = ({ title, subtitle, children, className = '' }: PanelProps) => (
  <section className={`an-card flex flex-col gap-5 p-6 min-w-0 ${className}`}>
    <header className="flex flex-col gap-1">
      <h2 className="an-body">{title}</h2>
      {subtitle && <p className="an-caption">{subtitle}</p>}
    </header>
    {children}
  </section>
)

/** Основной блок + узкая колонка 360px (как 1000/360 в макете) */
export const MainAsideRow = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] items-stretch">{children}</div>
)

/* ─── Легенда ────────────────────────────────────────────────── */
export const Legend = ({ items }: { items: Array<{ name: string; color: string }> }) => (
  <ul className="flex flex-wrap gap-x-6 gap-y-2">
    {items.map(item => (
      <li key={item.name} className="flex items-center gap-2">
        <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: item.color }} />
        <span className="an-caption" style={{ color: 'var(--an-text)' }}>{item.name}</span>
      </li>
    ))}
  </ul>
)

/* ─── Вывод ──────────────────────────────────────────────────── */
export const InsightCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="an-inset flex flex-col gap-2 p-4">
    <p className="an-body">{title}</p>
    <p className="an-caption">{children}</p>
  </div>
)

/* ─── Строка «название — сумма» ──────────────────────────────── */
export const ValueRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="an-inset flex items-center justify-between gap-3 px-3 py-2.5">
    <span className="an-caption truncate" style={{ color: 'var(--an-text)' }}>{label}</span>
    <span className="an-body whitespace-nowrap tabular-nums" style={color ? { color } : undefined}>{value}</span>
  </div>
)

/* ─── Таблица по месяцам ─────────────────────────────────────── */
export interface TableCell {
  value: string
  color?: string
  strong?: boolean
}

interface DataTableProps {
  columns: string[]
  rows: TableCell[][]
  footer?: TableCell[]
}

const Cell = ({ cell }: { cell: TableCell }) => (
  <td
    className={`px-3 tabular-nums whitespace-nowrap ${cell.strong ? 'font-semibold' : ''}`}
    style={{ color: cell.color ?? 'var(--an-text)' }}
  >
    {cell.value}
  </td>
)

export const DataTable = ({ columns, rows, footer }: DataTableProps) => (
  <div className="overflow-x-auto -mx-3 px-3">
    <table className="w-full table-fixed text-[12px] leading-4" style={{ minWidth: Math.max(520, columns.length * 140) }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--an-text-2)' }}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="[&>td]:py-[9px]" style={{ borderBottom: '1px solid var(--an-separator)' }}>
            {row.map((cell, j) => <Cell key={j} cell={cell} />)}
          </tr>
        ))}
      </tbody>
      {footer && (
        <tfoot>
          <tr className="[&>td]:py-3">
            {footer.map((cell, j) => <Cell key={j} cell={{ ...cell, strong: true }} />)}
          </tr>
        </tfoot>
      )}
    </table>
  </div>
)

/* ─── Полоса доли ────────────────────────────────────────────── */
export const ShareBar = ({ percent, color, height = 4 }: { percent: number; color: string; height?: number }) => (
  <div className="w-full overflow-hidden rounded-sm" style={{ height, background: 'var(--an-track)' }}>
    <div
      className="h-full rounded-sm transition-[width] duration-300"
      style={{ width: `${Math.max(0, Math.min(100, percent))}%`, background: color }}
    />
  </div>
)

/* ─── Пустое состояние / загрузка ────────────────────────────── */
export const EmptyState = ({ children = 'Нет операций за выбранный период' }: { children?: ReactNode }) => (
  <div className="flex items-center justify-center min-h-[120px] an-caption text-center px-4">{children}</div>
)

export const PanelSkeleton = ({ height = 290 }: { height?: number }) => (
  <div className="an-inset animate-pulse" style={{ height }} />
)

export const AnalyticsError = ({ onRetry }: { onRetry: () => void }) => (
  <Panel title="Не удалось загрузить аналитику">
    <p role="alert" className="an-caption">Проверьте подключение и попробуйте ещё раз.</p>
    <button type="button" onClick={onRetry} className="an-body self-start rounded-lg px-4 py-2 an-inset hover:opacity-90">
      Повторить
    </button>
  </Panel>
)

/* ─── Правила учёта ──────────────────────────────────────────── */
export const AccountingNote = () => (
  <div className="flex items-center gap-2">
    <img src={infoIcon} alt="" width={15} height={15} className="shrink-0" />
    <p className="an-caption">
      Переводы между своими счетами не включены в доходы и расходы. Переводы на накопления учитываются отдельно.
    </p>
  </div>
)
