import type { TransactionResponse } from '@/types/api.types'

export const HISTORY_PAGE_SIZE = 10
export type HistorySort = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'category-asc' | 'category-desc'

export const sortTransactions = (transactions: TransactionResponse[], sort: HistorySort) => {
  const date = (tx: TransactionResponse) => tx.transactionDate ? new Date(tx.transactionDate).getTime() || 0 : 0
  return [...transactions].sort((a, b) => {
    let comparison = 0
    switch (sort) {
      case 'date-desc': comparison = date(b) - date(a); break
      case 'date-asc': comparison = date(a) - date(b); break
      case 'amount-desc': comparison = b.amount - a.amount; break
      case 'amount-asc': comparison = a.amount - b.amount; break
      case 'category-asc': comparison = a.categoryName.localeCompare(b.categoryName, 'ru'); break
      case 'category-desc': comparison = b.categoryName.localeCompare(a.categoryName, 'ru'); break
    }
    return comparison || date(b) - date(a) || b.id.localeCompare(a.id)
  })
}
