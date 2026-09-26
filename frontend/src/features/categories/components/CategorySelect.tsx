// src/features/categories/components/CategorySelect.tsx

import { useMemo } from 'react';
import { SelectWithSearch, SelectOption } from '@/components/ui/SelectWithSearch';
import { useCategories } from '../hooks/useCategories';
import type { CategoryTreeResponse } from '@/types/api.types'; // Импорт типа из твоего API

// Типы фильтрации для гибкости
export type CategoryFilterType = 'all' | 'roots' | 'children';

interface CategorySelectProps {
    value: string;
    onChange: (id: string) => void;
    className?: string;
    filterType?: CategoryFilterType;
    placeholder?: string;
}

export const CategorySelect = ({
                                   value,
                                   onChange,
                                   className,
                                   filterType = 'children', // По умолчанию только дочерние (для транзакций)
                                   placeholder
                               }: CategorySelectProps) => {

    const { data: categoryTree, isLoading, isError } = useCategories();

    // Flatten tree to list
    const flattenCategories = (cats: CategoryTreeResponse[], parentId: string | null = null): Array<{ categoryId: string; parentId: string | null }> => {
        return cats.flatMap(cat => [
            { categoryId: cat.categoryId, parentId },
            ...flattenCategories(cat.childCategories, cat.categoryId)
        ])
    }

    const categories = useMemo(() => flattenCategories(categoryTree || []), [categoryTree]);

    const categoryMap = useMemo(() => {
        const map = new Map<string, string>();
        const buildMap = (cats: CategoryTreeResponse[]) => {
            cats.forEach(cat => {
                map.set(cat.categoryId, cat.name);
                buildMap(cat.childCategories);
            });
        };
        buildMap(categoryTree || []);
        return map;
    }, [categoryTree]);

    // БИЗНЕС-ЛОГИКА: Фильтрация на клиенте
    const filteredCategories = useMemo(() => {
        switch (filterType) {
            case 'roots':
                return categories.filter((cat) => cat.parentId == null);

            case 'children':
                return categories.filter((cat) => cat.parentId != null);

            case 'all':
            default:
                return categories;
        }
    }, [categories, filterType]);

    // Маппинг данных из API в формат UI-компонента
    const options: SelectOption<string>[] = filteredCategories.map((cat) => ({
        value: cat.categoryId,
        label: categoryMap.get(cat.categoryId) ?? cat.categoryId,
    }));

    if (isError) {
        return <div className="text-red-400 text-sm p-2 border border-red-500/30 rounded bg-red-500/10">Ошибка загрузки категорий</div>;
    }

    const defaultPlaceholder =
        filterType === 'roots' ? 'Выберите корневую категорию' :
            filterType === 'children' ? 'Выберите подкатегорию' :
                'Выберите категорию';

    return (
        <SelectWithSearch
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder || defaultPlaceholder}
            isLoading={isLoading}
            className={className}
        />
    );
};