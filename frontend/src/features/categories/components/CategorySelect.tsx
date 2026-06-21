// src/features/categories/components/CategorySelect.tsx

import { useMemo } from 'react';
import { SelectWithSearch, SelectOption } from '@/components/ui/SelectWithSearch';
import { useCategories } from '../hooks/useCategories';
import type { CategoryResponse } from '@/types/api.types'; // Импорт типа из твоего API

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

    const { data: categories, isLoading, isError } = useCategories();

    // БИЗНЕС-ЛОГИКА: Фильтрация на клиенте
    const filteredCategories = useMemo(() => {
        if (!categories) return [];

        switch (filterType) {
            case 'roots':
                // Корневые: у которых НЕТ родителя (parentId === null или undefined)
                return categories.filter((cat) => cat.parentId == null);

            case 'children':
                // Дочерние: у которых ЕСТЬ родитель (parentId !== null)
                return categories.filter((cat) => cat.parentId != null);

            case 'all':
            default:
                return categories;
        }
    }, [categories, filterType]);

    // Маппинг данных из API в формат UI-компонента
    const options: SelectOption<string>[] = filteredCategories.map((cat) => ({
        value: cat.id,
        label: cat.name,
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