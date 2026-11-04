import { useState, useRef, useMemo, useCallback, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { useCreateTransaction } from '../hooks/useTransactions'
import { toISODate } from '@/utils/formatters'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CategoryTreeResponse, CategoryType } from '@/types/api.types'

function findCategoryById(cats: CategoryTreeResponse[], id: string): CategoryTreeResponse | undefined {
  for (const cat of cats) {
    if (cat.categoryId === id) return cat
    const found = findCategoryById(cat.childCategories, id)
    if (found) return found
  }
  return undefined
}

function findCategoryWithParent(fullTree: CategoryTreeResponse[], id: string): { name: string; type: CategoryType; parentName: string } | undefined {
  let result: { name: string; type: CategoryType; parentName: string } | undefined

  function search(cats: CategoryTreeResponse[], parentId: string | null) {
    for (const cat of cats) {
      if (cat.categoryId === id) {
        let parentName = ''
        if (parentId) {
          const parent = findCategoryById(fullTree, parentId)
          parentName = parent?.name ?? ''
        }
        result = { name: cat.name, type: cat.type, parentName }
        return
      }
      search(cat.childCategories, cat.categoryId)
      if (result) return
    }
  }

  search(fullTree, null)
  return result
}

function flattenCategoriesForSelect(fullTree: CategoryTreeResponse[], cats: CategoryTreeResponse[], parentId: string | null = null): Array<{
  categoryId: string
  name: string
  type: CategoryType
  parentId: string | null
  parentName: string
}> {
  return cats.flatMap(cat => {
    const parent = parentId ? findCategoryById(fullTree, parentId) : undefined
    return [{
      categoryId: cat.categoryId,
      name: cat.name,
      type: cat.type,
      parentId,
      parentName: parent?.name ?? '',
    }, ...flattenCategoriesForSelect(fullTree, cat.childCategories, cat.categoryId)]
  })
}

const typeLabels: Record<CategoryType, string> = {
  EXPENSE: 'Расход',
  INCOME: 'Доход',
  SAVINGS: 'Накопление',
}

export const TransactionForm = () => {
  const today = toISODate(new Date())
  const { data: categoryTree = [] } = useCategories()

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const highlightRef = useRef(highlightedIndex)
  highlightRef.current = highlightedIndex

  const { mutate: create, isPending } = useCreateTransaction()

  // After successful creation, focus back to amount input
  const handleCreateSuccess = useCallback(() => {
    setTimeout(() => amountInputRef.current?.focus(), 50)
  }, [])

  // Memoized: flatten all categories
  const allCategories = useMemo(() => flattenCategoriesForSelect(categoryTree, categoryTree), [categoryTree])

  // Memoized: selected category info
  const selectedCategory = useMemo(
    () => (categoryId ? findCategoryWithParent(categoryTree, categoryId) : undefined),
    [categoryId, categoryTree],
  )

  // Memoized: filtered options (only child categories)
  const filteredOptions = useMemo(
    () =>
      !searchQuery
        ? allCategories.filter((cat) => cat.parentId !== null)
        : allCategories
            .filter((cat) => cat.parentId !== null)
            .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [allCategories, searchQuery],
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryId) return

    create(
      {
        amount: parseFloat(amount),
        categoryId,
        categoryName: selectedCategory?.name ?? '',
        description: description || null,
        transactionDate: `${date}T00:00:00`,
      },
      {
        onSuccess: () => {
          setAmount('')
          setCategoryId('')
          setDescription('')
          setDate(toISODate(new Date()))
          setSearchQuery('')
          handleCreateSuccess()
        },
      },
    )
  }

  const handleCategorySelect = (id: string) => {
    setCategoryId(id)
    setShowDropdown(false)
    setSearchQuery('')
    setHighlightedIndex(-1)
    setTimeout(() => descriptionInputRef.current?.focus(), 50)
  }

  const handleClearCategory = () => {
    setCategoryId('')
    setSearchQuery('')
    setHighlightedIndex(-1)
    setShowDropdown(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const idx = highlightRef.current

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShowDropdown(true)
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setShowDropdown(true)
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (idx >= 0 && idx < filteredOptions.length) {
        handleCategorySelect(filteredOptions[idx].categoryId)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setSearchQuery('')
      setHighlightedIndex(-1)
    }
  }

  const handleDropdownMouseEnter = (index: number) => {
    setHighlightedIndex(index)
  }

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownRef.current) return
    const item = dropdownRef.current.children[highlightedIndex] as HTMLElement
    if (item) {
      item.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <GlassCard padding="md">
      <p className="text-white/65 text-sm font-medium mb-4">Новая транзакция</p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          {/* Row 1: Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                Сумма
              </label>
              <input
                ref={amountInputRef}
                type="number"
                className="glass-input rounded-lg px-4 py-2.5 text-sm w-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                Дата
              </label>
              <DatePicker value={date} onChange={setDate} />
            </div>
          </div>

          {/* Row 2: Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
              Категория
            </label>
            <div className="relative w-full">
              {/* Selected category chip or input */}
              {selectedCategory ? (
                <div className="glass-input rounded-lg px-4 py-2.5 text-sm w-full flex items-center justify-between gap-2">
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-white text-sm font-medium truncate">{selectedCategory.name}</span>
                    <span className="text-[11px] text-white/40">{selectedCategory.parentName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearCategory}
                    className="text-white/30 hover:text-rose-400 transition-colors flex-shrink-0 p-0.5"
                    title="Сбросить"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <input
                  ref={searchInputRef}
                  type="text"
                  className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
                  placeholder="Выберите категорию..."
                  value={showDropdown ? searchQuery : ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200)
                  }}
                  onKeyDown={handleInputKeyDown}
                />
              )}

              {/* Dropdown */}
              {showDropdown && !selectedCategory && (
                <div
                  ref={dropdownRef}
                  className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl"
                >
                  {filteredOptions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-white/30">Ничего не найдено</div>
                  ) : (
                    filteredOptions.map((cat, index) => (
                      <button
                        key={cat.categoryId}
                        type="button"
                        onClick={() => handleCategorySelect(cat.categoryId)}
                        onMouseEnter={() => handleDropdownMouseEnter(index)}
                        className={[
                          'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2',
                          index === highlightedIndex
                            ? 'bg-purple-600/30 text-white'
                            : 'text-gray-300 hover:bg-white/5',
                        ].join(' ')}
                      >
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-white text-sm truncate">{cat.name}</span>
                          <span className="text-[11px] text-white/40">{cat.parentName}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Description + Submit */}
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Input
              ref={descriptionInputRef}
              label="Описание"
              type="text"
              placeholder="Покупка бананов"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isPending || !amount || !categoryId}
              className="glass-btn text-white text-sm rounded-lg px-6 py-2.5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center flex-shrink-0 self-end"
            >
              {isPending ? '...' : 'Создать'}
            </button>
          </div>
        </div>
      </form>
    </GlassCard>
  )
}
