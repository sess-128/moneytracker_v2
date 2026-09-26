import { useState, type FormEvent } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { AmountInput } from '@/components/ui/AmountInput'
import { DatePicker } from '@/components/ui/DatePicker'
import { useCreateTransaction } from '../hooks/useTransactions'
import { toISODate } from '@/utils/formatters'
import { CategorySelect } from '@/features/categories/components/CategorySelect'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CategoryTreeResponse } from '@/types/api.types'

function findCategoryById(cats: CategoryTreeResponse[], id: string): CategoryTreeResponse | undefined {
  for (const cat of cats) {
    if (cat.categoryId === id) return cat
    const found = findCategoryById(cat.childCategories, id)
    if (found) return found
  }
  return undefined
}

export const TransactionForm = () => {
  const today = toISODate(new Date())
  const { data: categoryTree = [] } = useCategories()

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today)

  const { mutate: create, isPending } = useCreateTransaction()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryId) return

    create(
      {
        amount: parseFloat(amount),
        categoryId,
        categoryName,
        description: description || null,
        transactionDate: `${date}T00:00:00`,
      },
      {
        onSuccess: () => {
          setAmount('')
          setCategoryName('')
          setCategoryId('')
          setDescription('')
        },
      },
    )
  }

  return (
    <GlassCard padding="md">
      <p className="text-white/65 text-sm font-medium mb-4">Создать новую транзакцию</p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <AmountInput value={amount} onChange={setAmount} />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                Категория
              </label>
              <CategorySelect
                  value={categoryId}
                  onChange={(id) => {
                    setCategoryId(id)
                    const cat = findCategoryById(categoryTree, id)
                    setCategoryName(cat?.name ?? '')
                  }}
                  filterType="children"
              />
            </div>
            {/* ---------------------------------- */}

          <Input
            label="Описание"
            type="text"
            placeholder="Покупка бананов"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-end gap-2">
            <DatePicker label="Дата" value={date} onChange={setDate} />
            <button
              type="submit"
              disabled={isPending}
              className="glass-btn text-white text-sm rounded-lg px-4 py-2.5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center flex-shrink-0"
            >
              Ok
            </button>
          </div>
        </div>
      </form>
    </GlassCard>
  )
}