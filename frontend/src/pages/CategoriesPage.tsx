import { useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronRight, FolderTree, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/categories/hooks/useCategories'
import type { CategoryTreeResponse, CategoryType } from '@/types/api.types'

type CategoryRow = CategoryTreeResponse & { parentId: string | null; parentName: string; depth: number }
const flatten = (tree: CategoryTreeResponse[], parentId: string | null = null, parentName = '', depth = 0): CategoryRow[] =>
  tree.flatMap(category => [{ ...category, parentId, parentName, depth }, ...flatten(category.childCategories, category.categoryId, category.name, depth + 1)])
const TYPE_LABELS: Record<CategoryType, string> = { EXPENSE: 'Расход', INCOME: 'Доход', SAVINGS: 'Накопление' }
const categoryCount = (count: number) => `${count} ${count % 100 >= 11 && count % 100 <= 14 ? 'категорий' : count % 10 === 1 ? 'категория' : count % 10 >= 2 && count % 10 <= 4 ? 'категории' : 'категорий'}`
const emptyForm = { name: '', type: 'EXPENSE' as CategoryType, parentId: '' }
const message = (error: unknown) => axios.isAxiosError(error) && typeof error.response?.data?.message === 'string' ? error.response.data.message : 'Не удалось сохранить изменения. Попробуйте ещё раз.'

export const CategoriesPage = () => {
  const { data: tree = [], isLoading, isError, refetch } = useCategories()
  const categories = useMemo(() => flatten(tree), [tree])
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [search, setSearch] = useState('')
  const [type, setType] = useState<CategoryType | ''>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRow | null>(null)
  const [deleting, setDeleting] = useState<CategoryRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const busy = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('ru')
    const byId = new Map(categories.map(category => [category.categoryId, category]))
    const matches = new Set<string>()
    if (query) {
      for (const category of categories) {
        if (type && category.type !== type) continue
        if (!`${category.name} ${category.parentName}`.toLocaleLowerCase('ru').includes(query)) continue
        let current: CategoryRow | undefined = category
        while (current) {
          matches.add(current.categoryId)
          current = current.parentId ? byId.get(current.parentId) : undefined
        }
      }
    }
    return categories.filter(category => {
      if (type && category.type !== type) return false
      if (query) return matches.has(category.categoryId)
      let parentId = category.parentId
      while (parentId) {
        if (!expanded.has(parentId)) return false
        parentId = byId.get(parentId)?.parentId ?? null
      }
      return true
    })
  }, [categories, search, type, expanded])
  const toggleCategory = (id: string) => setExpanded(previous => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const roots = categories.filter(category => !category.parentId && category.type === form.type && category.categoryId !== editing?.categoryId && !editing?.childCategories.some(child => child.categoryId === category.categoryId))

  const openForm = (category: CategoryRow | null = null) => {
    setEditing(category)
    setForm(category ? { name: category.name, type: category.type, parentId: category.parentId ?? '' } : emptyForm)
    setError('')
    setDialogOpen(true)
  }
  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) { setError('Введите название категории'); return }
    if (busy) return
    setError('')
    try {
      if (editing) await updateCategory.mutateAsync({ categoryId: editing.categoryId, name: form.name.trim(), categoryRoot: form.parentId || null })
      else await createCategory.mutateAsync({ name: form.name.trim(), type: form.type, parentId: form.parentId || null })
      if (form.parentId) setExpanded(previous => new Set(previous).add(form.parentId))
      setDialogOpen(false)
    } catch (err) { setError(message(err)) }
  }
  const remove = async () => {
    if (!deleting || busy) return
    setError('')
    try { await deleteCategory.mutateAsync(deleting.categoryId); setDeleting(null) }
    catch (err) { setError(message(err)) }
  }

  return (
    <main className="categories-page flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="an-title1">Категории</h1><p className="an-caption mt-1">Управляйте категориями доходов, расходов и накоплений</p></div>
        <button type="button" className="action-primary" onClick={() => openForm()}><Plus size={15} />Добавить категорию</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(TYPE_LABELS) as CategoryType[]).map(key => <section key={key} className="an-card p-5"><p className="an-caption">{TYPE_LABELS[key]}</p><p className={`category-type mt-2 ${key.toLowerCase()}`}>{categoryCount(categories.filter(category => category.type === key).length)}</p></section>)}
      </div>
      <section className="an-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2"><FolderTree size={16} className="text-[var(--an-chip-border)]" /><h2 className="an-title1">Все категории</h2><span className="an-caption">{categories.length}</span></div>
          <div className="category-filters flex flex-wrap gap-3">
            <label className="relative"><Search size={14} aria-hidden="true" className="absolute left-3 top-3 text-[var(--an-text-2)]" /><input aria-label="Поиск категорий" className="category-search" placeholder="Найти категорию…" value={search} onChange={event => setSearch(event.target.value)} /></label>
            <select aria-label="Тип категорий" className="history-select" value={type} onChange={event => setType(event.target.value as CategoryType | '')}><option value="">Все типы</option>{(Object.keys(TYPE_LABELS) as CategoryType[]).map(key => <option key={key} value={key}>{TYPE_LABELS[key]}</option>)}</select>
          </div>
        </div>
        {isLoading ? <p role="status" className="history-status">Загрузка категорий…</p> : isError ? <div role="alert" className="history-status">Не удалось загрузить категории.<button type="button" onClick={() => { void refetch() }} className="action-primary mt-3">Повторить</button></div> : visible.length === 0 ? <div className="history-status"><FolderTree size={32} className="mx-auto mb-4 text-[var(--an-chip-border)]" /><p>{categories.length ? 'Категории не найдены' : 'Пока нет категорий'}</p><p className="an-caption mt-2">{categories.length ? 'Попробуйте изменить поиск или тип.' : 'Добавьте первую категорию, чтобы распределять операции.'}</p></div> :
          <div className="overflow-x-auto"><table className="category-table"><thead><tr><th>Название</th><th>Тип</th><th>Родительская категория</th><th className="text-right">Действия</th></tr></thead><tbody>{visible.map(category => <tr key={category.categoryId}>
            <td><div style={{ paddingLeft: Math.min(category.depth, 3) * 16 }}>
              {category.childCategories.length > 0 ? <button type="button" className="category-branch" aria-expanded={Boolean(search.trim()) || expanded.has(category.categoryId)} onClick={() => toggleCategory(category.categoryId)}>
                {search.trim() || expanded.has(category.categoryId) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<FolderTree size={14} /><span>{category.name}</span><small className="an-caption">{category.childCategories.length}</small>
              </button> : <span className="category-leaf"><FolderTree size={14} /><span>{category.name}</span></span>}
            </div></td>
            <td><span className={`category-type ${category.type.toLowerCase()}`}>{TYPE_LABELS[category.type]}</span></td><td className="text-[var(--an-text-2)]">{category.parentName || '—'}</td>
            <td><div className="flex justify-end gap-2"><button type="button" className="icon-action" aria-label={`Редактировать ${category.name}`} onClick={() => openForm(category)}><Pencil size={14} /></button><button type="button" className="icon-action danger" aria-label={`Удалить ${category.name}`} onClick={() => { setDeleting(category); setError('') }}><Trash2 size={14} /></button></div></td>
          </tr>)}</tbody></table></div>}
      </section>
      {dialogOpen && <Modal title={editing ? 'Редактировать категорию' : 'Новая категория'} busy={busy} onClose={() => setDialogOpen(false)}>
        <form onSubmit={save} className="category-form flex flex-col gap-4">
          <label htmlFor="category-name">Название<input id="category-name" autoFocus className="category-input" placeholder="Например, продукты" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></label>
          <div><label htmlFor="category-type" className="mb-2">Тип</label><select id="category-type" className="category-input" value={form.type} disabled={Boolean(editing)} onChange={event => setForm({ ...form, type: event.target.value as CategoryType, parentId: '' })}>{(Object.keys(TYPE_LABELS) as CategoryType[]).map(key => <option key={key} value={key}>{TYPE_LABELS[key]}</option>)}</select></div>
          {editing && <p className="an-caption">Тип существующей категории изменить нельзя.</p>}
          <div><label htmlFor="category-parent" className="mb-2">Родительская категория</label><select id="category-parent" className="category-input" value={form.parentId} onChange={event => setForm({ ...form, parentId: event.target.value })}><option value="">Без родителя (корневая)</option>{roots.map(category => <option key={category.categoryId} value={category.categoryId}>{category.name}</option>)}</select></div>
          {error && <p role="alert" className="text-xs text-[var(--an-red)]">{error}</p>}
          <div className="flex justify-end gap-2 mt-2"><button type="button" className="pagination-button" disabled={busy} onClick={() => setDialogOpen(false)}>Отмена</button><button type="submit" className="action-primary" disabled={busy}>{busy ? 'Сохранение…' : editing ? 'Сохранить' : 'Создать'}</button></div>
        </form>
      </Modal>}
      {deleting && <Modal title="Удалить категорию" busy={busy} onClose={() => setDeleting(null)}><p className="an-caption leading-6">Удалить категорию «{deleting.name}»?{deleting.childCategories.length > 0 && ' У категории есть подкатегории.'}</p>{error && <p role="alert" className="text-xs text-[var(--an-red)] mt-3">{error}</p>}<div className="flex justify-end gap-2 mt-6"><button type="button" disabled={busy} className="pagination-button" onClick={() => setDeleting(null)}>Отмена</button><button type="button" disabled={busy} className="action-danger" onClick={() => { void remove() }}>{busy ? 'Удаление…' : 'Удалить'}</button></div></Modal>}
    </main>
  )
}
