import type { AnalyticsTransactionGroup, AnalyticsTransactionItem, CategoryTreeResponse } from '@/types/api.types'
import { sortGroups, subtreeItems, sum } from '@/features/analytics/lib/aggregate'

export const UNPARENTED_EXPENSES_ID = '__expenses_without_parent__'

/** Восстанавливает родителей из каталога, в том числе для плоского ответа аналитики. */
export const expenseCategoryTree = (
  groups: AnalyticsTransactionGroup[],
  catalog: CategoryTreeResponse[],
): AnalyticsTransactionGroup[] => {
  const names = new Map<string, string>()
  const parents = new Map<string, string | null>()
  const types = new Map<string, CategoryTreeResponse['type']>()
  const order = new Map<string, number>()
  const catalogParents = new Set<string>()
  const items = new Map<string, AnalyticsTransactionItem>()

  const readGroups = (nodes: AnalyticsTransactionGroup[], parentId: string | null = null) => {
    nodes.forEach(node => {
      names.set(node.categoryId, node.categoryName)
      parents.set(node.categoryId, parentId)
      node.items.forEach(item => items.set(item.id, item))
      readGroups(node.childCategories, node.categoryId)
    })
  }
  const readCatalog = (nodes: CategoryTreeResponse[], parentId: string | null = null) => {
    nodes.forEach(node => {
      names.set(node.categoryId, node.name)
      parents.set(node.categoryId, parentId)
      types.set(node.categoryId, node.type)
      order.set(node.categoryId, order.size)
      if (node.childCategories.length > 0) catalogParents.add(node.categoryId)
      readCatalog(node.childCategories, node.categoryId)
    })
  }
  readGroups(groups)
  readCatalog(catalog)

  const ownItems = new Map<string, AnalyticsTransactionItem[]>()
  items.forEach(item => {
    const type = types.get(item.categoryId)
    if (type && type !== 'EXPENSE') return
    const categoryItems = ownItems.get(item.categoryId) ?? []
    categoryItems.push(item)
    ownItems.set(item.categoryId, categoryItems)
    if (!names.has(item.categoryId)) names.set(item.categoryId, item.categoryName)
  })

  // Родитель без собственных операций тоже должен присутствовать в списке.
  const active = new Set<string>()
  ownItems.forEach((_, categoryId) => {
    let current: string | null = categoryId
    while (current && !active.has(current)) {
      const type = types.get(current)
      if (type && type !== 'EXPENSE') break
      active.add(current)
      current = parents.get(current) ?? null
    }
  })
  const children = new Map<string | null, string[]>()
  active.forEach(id => {
    const parent = parents.get(id)
    const key = parent && active.has(parent) ? parent : null
    children.set(key, [...(children.get(key) ?? []), id])
  })

  const total = sum([...ownItems.values()].flat().map(item => Number(item.amount) || 0))
  const build = (id: string, path: Set<string> = new Set()): AnalyticsTransactionGroup | null => {
    if (path.has(id)) return null
    const nextPath = new Set(path).add(id)
    const childCategories = (children.get(id) ?? [])
      .map(child => build(child, nextPath))
      .filter((child): child is AnalyticsTransactionGroup => child !== null)
      .sort((a, b) => (order.get(a.categoryId) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.categoryId) ?? Number.MAX_SAFE_INTEGER))
    const direct = ownItems.get(id) ?? []
    const subtree = (node: AnalyticsTransactionGroup): AnalyticsTransactionItem[] =>
      [...node.items, ...node.childCategories.flatMap(subtree)]
    const allItems = [...direct, ...childCategories.flatMap(subtree)]
    const amount = sum(allItems.map(item => Number(item.amount) || 0))
    const monthly = new Map<string, number>()
    allItems.forEach(item => {
      const key = item.transactionDate.slice(0, 7)
      monthly.set(key, (monthly.get(key) ?? 0) + (Number(item.amount) || 0))
    })
    return {
      categoryId: id,
      categoryName: names.get(id) ?? id,
      items: direct,
      childCategories,
      summary: {
        sum: amount,
        percentage: total > 0 ? amount / total * 100 : 0,
        maxForMonth: Math.max(0, ...monthly.values()),
        average: allItems.length ? amount / allItems.length : 0,
      },
    }
  }
  const roots = (children.get(null) ?? [])
    .map(id => build(id))
    .filter((node): node is AnalyticsTransactionGroup => node !== null)

  const parentGroups = roots.filter(node => node.childCategories.length > 0 || catalogParents.has(node.categoryId))
  const unparented = roots.filter(node => node.childCategories.length === 0 && !catalogParents.has(node.categoryId))
  if (unparented.length === 0) return sortGroups(parentGroups)

  // Отдельные категории не выводим на одном уровне с родительскими ветками.
  // Сохраняем их суммы в явно обозначенной раскрываемой группе.
  const unparentedItems = unparented.flatMap(subtreeItems)
  const amount = sum(unparented.map(node => node.summary.sum))
  const monthly = new Map<string, number>()
  unparentedItems.forEach(item => {
    const key = item.transactionDate.slice(0, 7)
    monthly.set(key, (monthly.get(key) ?? 0) + (Number(item.amount) || 0))
  })
  return sortGroups([...parentGroups, {
    categoryId: UNPARENTED_EXPENSES_ID,
    categoryName: 'Без родительской категории',
    items: [],
    childCategories: sortGroups(unparented),
    summary: {
      sum: amount,
      percentage: total > 0 ? amount / total * 100 : 0,
      maxForMonth: Math.max(0, ...monthly.values()),
      average: unparentedItems.length ? amount / unparentedItems.length : 0,
    },
  }])
}
