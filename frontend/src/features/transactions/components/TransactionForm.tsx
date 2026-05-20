import { useState, type FormEvent } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { useCreateTransaction } from '../hooks/useTransactions'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { toISODate } from '@/utils/formatters'

export const TransactionForm = () => {
  const today = toISODate(new Date())

  const [amount, setAmount] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today)

  const { data: categories = [] } = useCategories()
  const { mutate: create, isPending } = useCreateTransaction()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryName || !description) return

    create(
      {
        amount: parseFloat(amount),
        categoryName,
        description,
        startDate: date,
        endDate: date,
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
          <Input
            label="Сумма"
            type="number"
            placeholder="₽ 1,445.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
              Категория
            </label>
            <select
              className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            >
              <option value="">Выберите</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
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
            required
          />

          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                Дата
              </label>
              <input
                type="date"
                className="glass-input rounded-lg px-3 py-2.5 text-sm w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="glass-btn text-white text-sm rounded-lg px-4 py-2.5
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center"
            >
              Ok
            </button>
          </div>
        </div>
      </form>
    </GlassCard>
  )
}
