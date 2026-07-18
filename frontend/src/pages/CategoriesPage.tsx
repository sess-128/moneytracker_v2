import { useState } from 'react'
import { createPortal } from 'react-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/categories/hooks/useCategories'
import type { CategoryResponse } from '@/types/api.types'

interface CategoryForm {
  name: string
  type: 'EXPENSE' | 'INCOME'
  parentId: string | null
}

const emptyForm: CategoryForm = { name: '', type: 'EXPENSE', parentId: null }

export const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useCategories()
  const { mutate: createCat } = useCreateCategory()
  const { mutate: updateCat } = useUpdateCategory()
  const { mutate: deleteCat } = useDeleteCategory()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<CategoryResponse | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [error, setError] = useState('')

  const rootCategories = categories.filter((c) => !c.parentId)

  const openCreate = () => {
    setEditingCat(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const openEdit = (cat: CategoryResponse) => {
    setEditingCat(cat)
    setForm({ name: cat.name, type: cat.type, parentId: cat.parentId ?? null })
    setError('')
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingCat(null)
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      setError('Введите название категории')
      return
    }

    if (editingCat) {
      updateCat(
        { id: editingCat.id, name: form.name, type: form.type, parentId: form.parentId },
        { onSuccess: closeDialog, onError: (e: any) => setError(e.response?.data?.message || 'Ошибка обновления') },
      )
    } else {
      createCat(
        { name: form.name, type: form.type, parentId: form.parentId },
        { onSuccess: closeDialog, onError: (e: any) => setError(e.response?.data?.message || 'Ошибка создания') },
      )
    }
  }

  const handleDelete = (cat: CategoryResponse) => {
    if (!window.confirm(`Удалить категорию «${cat.name}»?`)) return
    deleteCat(cat.id, {
      onError: (e: any) => alert(e.response?.data?.message || 'Не удалось удалить категорию'),
    })
  }

  const getParentName = (cat: CategoryResponse) => {
    if (!cat.parentId) return '—'
    return categories.find((c) => c.id === cat.parentId)?.name ?? cat.parentId
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className="text-white text-lg font-medium">Управление категориями</h2>
        <button onClick={openCreate} className="glass-btn text-white text-sm rounded-lg px-4 py-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Добавить
        </button>
      </div>

      <GlassCard padding="none" className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-white/40 text-sm">Загрузка...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-white/40 text-sm">Нет категорий</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-[11px] uppercase tracking-wider border-b border-white/5">
                <th className="text-left px-4 py-3 font-medium">Название</th>
                <th className="text-left px-4 py-3 font-medium">Тип</th>
                <th className="text-left px-4 py-3 font-medium">Родитель</th>
                <th className="text-right px-4 py-3 font-medium w-24">Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      cat.type === 'INCOME'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {cat.type === 'INCOME' ? 'Доход' : 'Расход'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{getParentName(cat)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(cat)}
                      className="glass-btn rounded-lg px-2.5 py-1.5 text-xs text-white/60 hover:text-white mr-1"
                      title="Редактировать"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="glass-btn rounded-lg px-2.5 py-1.5 text-xs text-rose-400/60 hover:text-rose-400"
                      title="Удалить"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>

      {dialogOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="dark-card rounded-2xl p-6 w-full shadow-2xl"
            style={{ maxWidth: 420 }}
          >
            <h3 className="text-white text-base font-medium mb-5">
              {editingCat ? 'Редактировать категорию' : 'Новая категория'}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                  Название
                </label>
                <input
                  className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Название категории"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                  Тип
                </label>
                <select
                  className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'EXPENSE' | 'INCOME' })}
                >
                  <option value="EXPENSE">Расход</option>
                  <option value="INCOME">Доход</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-white/45 uppercase tracking-wider font-medium">
                  Родительская категория
                </label>
                <select
                  className="glass-input rounded-lg px-4 py-2.5 text-sm w-full"
                  value={form.parentId ?? ''}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                >
                  <option value="">Без родителя (корневая)</option>
                  {rootCategories
                    .filter((c) => editingCat ? c.id !== editingCat.id : true)
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              {error && (
                <p className="text-xs text-rose-400">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={closeDialog}
                className="glass-btn text-white/70 text-sm rounded-lg px-4 py-2 hover:text-white"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="bg-white text-gray-900 text-sm font-medium rounded-lg px-5 py-2 hover:bg-gray-100 transition-colors"
              >
                {editingCat ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
