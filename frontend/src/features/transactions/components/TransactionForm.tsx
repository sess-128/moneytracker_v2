import { useState, type FormEvent } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { AmountInput } from '@/components/ui/AmountInput'
import { DatePicker } from '@/components/ui/DatePicker'
import { useCreateTransaction } from '../hooks/useTransactions'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { toISODate } from '@/utils/formatters'

export const TransactionForm = () => {
  const today = toISODate(new Date())

  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today)

  const { data: categories = [], isError: categoriesError, isLoading: categoriesLoading } = useCategories()
  const { mutate: create, isPending } = useCreateTransaction()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryId) return

    create(
      {
        amount: parseFloat(amount),
        categoryId,
        description: description || null,
        transactionDate: `${date}T00:00:00`,
      },
      {
        onSuccess: () => {
          setAmount('')
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

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
              Категория
            </label>
            <select
              className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">
                {categoriesError ? 'Ошибка загрузки' : categoriesLoading ? 'Загрузка...' : 'Выберите'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

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
