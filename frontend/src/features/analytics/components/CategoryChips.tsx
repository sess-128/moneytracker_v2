import { useState } from 'react'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CategoryTreeResponse } from '@/types/api.types'

interface CategoryChipsProps {
  selectedParentId: string | null
  selectedParentName: string | null
  onSelectParent: (id: string | null, name: string | null) => void
  selectedChildIds: string[]
  onSelectChildren: (ids: string[]) => void
}

export const CategoryChips = ({
  selectedParentId,
  selectedParentName,
  onSelectParent,
  selectedChildIds,
  onSelectChildren,
}: CategoryChipsProps) => {
  const { data: categoryTree = [] } = useCategories()
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null)
  const [subcategories, setSubcategories] = useState<CategoryTreeResponse[]>([])

  const flattenCategories = (cats: CategoryTreeResponse[]): Array<{ categoryId: string; name: string }> => {
    return cats.flatMap(cat => [
      { categoryId: cat.categoryId, name: cat.name },
      ...flattenCategories(cat.childCategories),
    ])
  }

  const allCategories = flattenCategories(categoryTree)

  const handleParentClick = (id: string, name: string) => {
    if (selectedParentId === id) {
      onSelectParent(null, null)
      onSelectChildren([])
      setExpandedParentId(null)
      setSubcategories([])
      return
    }

    onSelectParent(id, name)
    setExpandedParentId(id)

    if (expandedParentId === id && subcategories.length > 0) {
      setExpandedParentId(null)
      setSubcategories([])
      return
    }

    const loadChildren = async () => {
      try {
        const response = await fetch(`/api/v1/categories?parentId=${encodeURIComponent(id)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        })
        const data = await response.json()
        setSubcategories(Array.isArray(data) ? data : [])
      } catch {
        setSubcategories([])
      }
    }

    loadChildren()
  }

  const handleChildClick = (id: string) => {
    const newIds = selectedChildIds.includes(id)
      ? selectedChildIds.filter(cid => cid !== id)
      : [...selectedChildIds, id]
    onSelectChildren(newIds)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            onSelectParent(null, null)
            onSelectChildren([])
            setExpandedParentId(null)
            setSubcategories([])
          }}
          className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
            !selectedParentId
              ? 'bg-purple-600 text-white font-medium'
              : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/90'
          }`}
        >
          Все категории
        </button>

        {categoryTree.map(cat => (
          <button
            key={cat.categoryId}
            onClick={() => handleParentClick(cat.categoryId, cat.name)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 ${
              selectedParentId === cat.categoryId
                ? 'bg-purple-600 text-white font-medium'
                : 'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/90'
            }`}
          >
            {cat.name}
            {selectedParentId === cat.categoryId && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {expandedParentId && subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
          <span className="px-3 py-1.5 rounded-full text-[10px] text-white/30 bg-white/5">
            Все подкатегории
          </span>
          {subcategories.map(sub => (
            <button
              key={sub.categoryId}
              onClick={() => handleChildClick(sub.categoryId)}
              className={`px-3 py-1 rounded-full text-[11px] transition-all duration-200 ${
                selectedChildIds.includes(sub.categoryId)
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                  : 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {expandedParentId && subcategories.length === 0 && (
        <p className="text-[10px] text-white/25 italic">
          Подкатегории подгрузятся по запросу...
        </p>
      )}
    </div>
  )
}
