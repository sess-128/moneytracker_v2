import { useId, useState } from 'react'
import type { AnalyticsTransactionGroup } from '@/types/api.types'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { groupTotal, share, sum } from '@/features/analytics/lib/aggregate'

interface CategoryTreeProps {
  roots: AnalyticsTransactionGroup[]
  total: number
  accent?: string
  expanded: Set<string>
  onToggle: (id: string) => void
}

const Chevron = ({ open }: { open: boolean }) => (
  <span aria-hidden="true" className="inline-flex w-2 shrink-0 justify-center transition-transform duration-150" style={{ transform: open ? 'rotate(90deg)' : undefined }}>›</span>
)

/** Подкатегории остаются внутри блока своего родителя на любой глубине. */
const CategoryChildren = ({ group, expanded, onToggle }: {
  group: AnalyticsTransactionGroup
  expanded: Set<string>
  onToggle: (id: string) => void
}) => {
  const id = useId()
  const own = sum(group.items.map(item => Number(item.amount) || 0))
  return (
    <ul className="m-0 list-none p-0" aria-label={`Подкатегории: ${group.categoryName}`}>
      {group.childCategories.map(child => {
        const hasChildren = child.childCategories.length > 0
        const open = expanded.has(child.categoryId)
        const regionId = `${id}-${child.categoryId}`
        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2 an-caption">
              {hasChildren ? <Chevron open={open} /> : <span aria-hidden="true" className="w-2 shrink-0" />}
              <span className="truncate">{child.categoryName}</span>
            </span>
            <span className="an-body shrink-0 whitespace-nowrap tabular-nums">{formatCurrency(groupTotal(child))}</span>
          </>
        )
        return (
          <li key={child.categoryId}>
            {hasChildren ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={open ? regionId : undefined}
                onClick={() => onToggle(child.categoryId)}
                className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-0 text-left hover:bg-[var(--an-hover)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--an-chip-border)]"
              >{content}</button>
            ) : (
              <div className="flex min-h-9 items-center justify-between gap-3">{content}</div>
            )}
            {hasChildren && open && (
              <div id={regionId} className="pl-6">
                <CategoryChildren group={child} expanded={expanded} onToggle={onToggle} />
              </div>
            )}
          </li>
        )
      })}
      {own !== 0 && (
        <li className="flex min-h-9 items-center justify-between gap-3">
          <span className="an-caption min-w-0 truncate">Операции в «{group.categoryName}»</span>
          <span className="an-body shrink-0 whitespace-nowrap tabular-nums">{formatCurrency(own)}</span>
        </li>
      )}
    </ul>
  )
}

export const CategoryTreeColumn = ({ roots, total, accent, expanded, onToggle }: CategoryTreeProps) => {
  const id = useId()
  return (
    <ul className="m-0 flex min-w-0 list-none flex-col gap-1.5 p-0" aria-label="Категории расходов">
      {roots.map((root, index) => {
        const hasChildren = root.childCategories.length > 0 || root.items.length > 0
        const open = expanded.has(root.categoryId)
        const regionId = `${id}-${root.categoryId}`
        const content = (
          <>
            <span className="flex min-w-0 items-center gap-2.5 text-[12px] leading-4">
              <span className="flex min-w-0 items-center gap-2" style={{ color: 'var(--an-text)' }}>
                {hasChildren ? <Chevron open={open} /> : <span aria-hidden="true" className="w-2 shrink-0" />}
                <span className="truncate">{root.categoryName}</span>
              </span>
              <span className="shrink-0 an-caption">{formatPercent(share(groupTotal(root), total))}</span>
            </span>
            <span className="an-body shrink-0 whitespace-nowrap tabular-nums" style={index === 0 && accent ? { color: accent } : undefined}>
              {formatCurrency(groupTotal(root))}
            </span>
          </>
        )
        return (
          <li key={root.categoryId} className="flex min-w-0 flex-col gap-1.5">
            {hasChildren ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={open ? regionId : undefined}
                onClick={() => onToggle(root.categoryId)}
                className="an-inset flex min-h-9 w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[var(--an-hover)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--an-chip-border)]"
              >{content}</button>
            ) : (
              <div className="an-inset flex min-h-9 items-center justify-between gap-3 px-3 py-2">{content}</div>
            )}
            {hasChildren && open && (
              <div id={regionId} className="an-inset min-w-0 px-2 py-0.5">
                <CategoryChildren group={root} expanded={expanded} onToggle={onToggle} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export const useExpandedCategories = () => {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  return { expanded, toggle, setExpanded }
}
