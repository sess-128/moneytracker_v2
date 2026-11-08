import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { sortTransactions, type HistorySort } from '../lib/history'
import { Modal } from '@/components/ui/Modal'
import { GlassCard } from '@/components/ui/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/authStore'
import { useDeleteTransaction } from '@/features/transactions/hooks/useTransactions'
import type { TransactionResponse, CategoryType } from '@/types/api.types'
import { formatCurrency, formatDate } from '@/utils/formatters'

const getTypeConfig = (type: CategoryType) => {
  switch (type) {
    case 'INCOME':
      return { label: 'ДОХОД', className: 'text-emerald-400' }
    case 'SAVINGS':
      return { label: 'НАКОПЛЕНИЕ', className: 'text-blue-400' }
    case 'EXPENSE':
    default:
      return { label: 'РАСХОД', className: 'text-red-400' }
  }
}

interface TransactionTableProps {
  transactions: TransactionResponse[]
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isLoading: boolean
  isError: boolean
  retry: () => void
}

export const TransactionTable = ({ transactions, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, isError, retry }: TransactionTableProps) => {
  const username = useAuthStore((s) => s.user?.login ?? '')
  const { mutate: deleteTx, isPending: isDeleting, isError: deleteFailed, reset: resetDelete } = useDeleteTransaction()

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const openDelete = (id: string, name: string) => {
    resetDelete()
    setDeleteTarget({ id, name })
  }

  const closeDelete = () => {
    setDeleteTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget || isDeleting) return
    deleteTx(deleteTarget.id, { onSuccess: closeDelete })
  }

  const scrollRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const total = transactions.length
  const [sort, setSort] = useState<HistorySort>('date-desc')
  const needsAllPages = sort !== 'date-desc'
  const loading = isLoading || (needsAllPages && hasNextPage && !isError)

  useEffect(() => {
    if (needsAllPages && hasNextPage && !isFetchingNextPage && !isError) fetchNextPage()
  }, [needsAllPages, hasNextPage, isFetchingNextPage, isError, fetchNextPage, total])

  useEffect(() => {
    const root = scrollRef.current
    const target = loadMoreRef.current
    if (!root || !target || loading || isError || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) fetchNextPage()
    }, { root, rootMargin: '0px 0px 120px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [loading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, total])

  const visibleTransactions = useMemo(() => sortTransactions(transactions, sort), [transactions, sort])
  const changeSort = (next: HistorySort) => {
    setSort(next)
    scrollRef.current?.scrollTo({ top: 0 })
  }
  const sortColumn = (column: 'date' | 'amount' | 'category') => {
    changeSort(`${column}-${sort === `${column}-asc` ? 'desc' : 'asc'}` as HistorySort)
  }
  const sortIcon = (column: 'date' | 'amount' | 'category') =>
    sort === `${column}-asc` ? <ArrowUp size={12} /> : sort === `${column}-desc` ? <ArrowDown size={12} /> : <ArrowUpDown size={12} />

  return (
    <GlassCard padding="lg" className="transaction-history flex flex-col flex-1 min-w-0">
      <div className="flex justify-between items-center mb-4"><h2 className="an-title1">Последние операции</h2><span className="an-caption rounded-full bg-[var(--an-inset)] px-3 py-1">{total}{hasNextPage ? '+' : ''} транзакций</span></div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <label className="an-caption flex flex-wrap items-center gap-2">
          Сортировка
          <select aria-label="Сортировка операций" className="history-select" value={sort} onChange={event => changeSort(event.target.value as HistorySort)}>
            <option value="date-desc">Сначала новые</option>
            <option value="date-asc">Сначала старые</option>
            <option value="amount-desc">Сумма: по убыванию</option>
            <option value="amount-asc">Сумма: по возрастанию</option>
            <option value="category-asc">Категория: А–Я</option>
            <option value="category-desc">Категория: Я–А</option>
          </select>
        </label>
      </div>
      {isError && total === 0 ? <div role="alert" className="history-status"><p>Не удалось загрузить операции.</p><button type="button" onClick={retry} className="action-primary mt-3">Повторить</button></div> : loading ? <div role="status" className="history-status">{needsAllPages && hasNextPage ? 'Загружаем операции для сортировки…' : 'Загрузка операций…'}</div> : <div ref={scrollRef} className="history-table-scroll" aria-label="Список последних операций" tabIndex={0} aria-busy={isFetchingNextPage}>
        <table className="history-table">
          <colgroup><col /><col className="history-type-column" /><col className="history-amount-column" /><col className="history-date-column" /><col className="history-action-column" /></colgroup>
          <thead><tr>
            <th scope="col"><button type="button" className="history-sort-heading" aria-label="Сортировать по категории" onClick={() => sortColumn('category')}>Категория{sortIcon('category')}</button></th>
            <th scope="col">Тип</th>
            <th scope="col"><button type="button" className="history-sort-heading" aria-label="Сортировать по сумме" onClick={() => sortColumn('amount')}>Сумма{sortIcon('amount')}</button></th>
            <th scope="col"><button type="button" className="history-sort-heading" aria-label="Сортировать по дате" onClick={() => sortColumn('date')}>Дата{sortIcon('date')}</button></th>
            <th scope="col"><span className="sr-only">Действия</span></th>
          </tr></thead>
          <tbody>
            {total === 0 ? <tr><td colSpan={5} className="history-status">Нет транзакций</td></tr> : visibleTransactions.map(tx => {
              const typeConfig = getTypeConfig(tx.type)
              return <tr key={tx.id} className="transaction-row">
                <td><div className="history-category-cell"><Avatar username={username} size={28} /><span className="truncate" title={tx.categoryName}>{tx.categoryName}</span></div></td>
                <td className={`history-type ${typeConfig.className}`}>{typeConfig.label}</td>
                <td className="history-amount tabular-nums">{formatCurrency(tx.amount)}</td>
                <td>{tx.transactionDate && !Number.isNaN(new Date(tx.transactionDate).getTime()) ? <time dateTime={tx.transactionDate} className="history-date" title="Дата операции">{formatDate(tx.transactionDate)}</time> : <span className="an-caption" title="Дата операции не указана">—</span>}</td>
                <td><button type="button" onClick={() => openDelete(tx.id, tx.categoryName)} className="icon-action danger" title="Удалить"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v5M14 11v5" /></svg></button></td>
              </tr>
            })}
          </tbody>
        </table>
        {isError && <div role="alert" className="history-status"><p>Не удалось загрузить следующие операции.</p><button type="button" onClick={retry} className="action-primary mt-3">Повторить</button></div>}
        <div ref={loadMoreRef} className="history-load-more" role="status">{isFetchingNextPage ? 'Загрузка операций…' : hasNextPage && !isError ? 'Прокрутите вниз, чтобы загрузить ещё' : ''}</div>
      </div>}
      <p className="an-caption mt-4" aria-live="polite">{total === 0 ? 'Нет операций' : `Загружено ${total} операций${hasNextPage ? '' : ' · Все операции'}`}</p>
      {deleteTarget && <Modal title="Удалить транзакцию" busy={isDeleting} onClose={closeDelete}>
        <p className="an-caption leading-6">Удалить транзакцию из «{deleteTarget.name}»?</p>
        {deleteFailed && <p role="alert" className="text-xs text-[var(--an-red)] mt-3">Не удалось удалить операцию. Попробуйте ещё раз.</p>}
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" disabled={isDeleting} className="pagination-button" onClick={closeDelete}>Отмена</button>
          <button type="button" disabled={isDeleting} className="action-danger" onClick={handleDelete}>{isDeleting ? 'Удаление…' : 'Удалить'}</button>
        </div>
      </Modal>}
    </GlassCard>
  )
}
