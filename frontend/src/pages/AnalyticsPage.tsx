import { useState, useMemo, useCallback } from 'react'
import { DateFilters } from '@/features/analytics/components/DateFilters'
import { SummaryCard } from '@/features/analytics/components/SummaryCard'
import { TopCategories } from '@/features/analytics/components/TopCategories'
import { MonthlyChart } from '@/features/analytics/components/MonthlyChart'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useAnalytics, useInvalidateAnalytics } from '@/features/analytics/hooks/useAnalytics'
import type { CategoryTreeResponse, AnalyticsFilterRequest, TransactionResponse } from '@/types/api.types'

const flattenCategories = (cats: CategoryTreeResponse[]): Array<{ categoryId: string; name: string }> => {
  return cats.flatMap(cat => [
    { categoryId: cat.categoryId, name: cat.name },
    ...flattenCategories(cat.childCategories),
  ])
}

export const AnalyticsPage = () => {
  const { data: transactions = [] } = useTransactions()
  const { data: categoryTree = [] } = useCategories()

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [searchParams, setSearchParams] = useState<AnalyticsFilterRequest | null>(null)

  const allCategories = useMemo(() => flattenCategories(categoryTree), [categoryTree])

  const invalidateAnalytics = useInvalidateAnalytics()
  const { data: analyticsData } = useAnalytics(searchParams)

  // Фильтруем транзакции по категориям + дате из searchParams
  const filteredTransactions = useMemo<TransactionResponse[]>(() => {
    let filtered = transactions

    // Фильтр по категориям
    if (selectedCategoryIds.length > 0) {
      filtered = filtered.filter(tx => selectedCategoryIds.includes(tx.categoryId))
    }

    // Фильтр по дате из searchParams
    if (searchParams) {
      const start = new Date(searchParams.startDate)
      const end = searchParams.endDate ? new Date(searchParams.endDate) : new Date()
      filtered = filtered.filter(tx => {
        if (!tx.transactionDate) return false
        const d = new Date(tx.transactionDate)
        return d >= start && d <= end
      })
    }

    return filtered
  }, [transactions, selectedCategoryIds, searchParams])

  const handleCategoryToggle = useCallback((id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id)
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    )
  }, [])

  const handleSearch = useCallback((params: AnalyticsFilterRequest) => {
    setSearchParams({
      ...params,
      categoryIds: selectedCategoryIds,
    })
    // Принудительно перезапрашиваем данные
    invalidateAnalytics()
  }, [selectedCategoryIds, invalidateAnalytics])

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto">
      {/* Filters */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        <DateFilters onSearchClick={handleSearch} />

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map(cat => (
            <button
              key={cat.categoryId}
              onClick={() => handleCategoryToggle(cat.categoryId)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                selectedCategoryIds.includes(cat.categoryId)
                  ? 'bg-purple-600 text-white font-medium'
                  : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/90'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid gap-3 min-h-0" style={{ gridTemplateColumns: '40% 1fr' }}>
        <div className="flex flex-col gap-3 min-h-0">
          <SummaryCard transactions={filteredTransactions} />
          <TopCategories data={analyticsData ?? []} />
        </div>
        <MonthlyChart transactions={filteredTransactions} />
      </div>
    </div>
  )
}
