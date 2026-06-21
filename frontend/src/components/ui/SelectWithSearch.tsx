import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// Универсальный интерфейс для опций
export interface SelectOption<T> {
    value: T;
    label: string;
}

interface SelectWithSearchProps<T> {
    options: SelectOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    placeholder?: string;
    isLoading?: boolean;
    error?: string;
    className?: string;
}

export function SelectWithSearch<T extends string | number>({
                                                                options,
                                                                value,
                                                                onChange,
                                                                placeholder = 'Выберите...',
                                                                isLoading = false,
                                                                error,
                                                                className = '',
                                                            }: SelectWithSearchProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

    // Оптимизированная фильтрация
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: T) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {/* Триггер */}
            <div
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                className={`
          flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-lg border cursor-pointer transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-blue-500'}
          bg-[#1a1a1a] text-white hover:bg-[#252525]
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            >
                <input
                    type="text"
                    readOnly={!isOpen}
                    placeholder={placeholder}
                    value={isOpen ? searchQuery : selectedLabel}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    className="bg-transparent outline-none w-full placeholder:text-gray-500"
                />

                {isLoading ? (
                    <span className="ml-2 animate-spin"></span>
                ) : (
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </div>

            {/* Дропдаун */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl custom-scrollbar">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={String(option.value)}
                                onClick={() => handleSelect(option.value)}
                                className={`
                  px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${option.value === value ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300 hover:bg-white/5'}
                `}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 italic flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Ничего не найдено
                        </div>
                    )}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}