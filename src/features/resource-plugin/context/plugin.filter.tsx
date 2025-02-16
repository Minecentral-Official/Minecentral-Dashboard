'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  pluginCategoriesConfig,
  PluginCategory,
} from '@/features/resource-plugin/config/categories.plugin';
import resourcesFindAndFilter from '@/features/resource-plugin/queries/resources-find.filter';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';
import { useDebounce } from '@/hooks/use-debounce';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface FilterPluginContextType {
  plugins: TResourcePlugin[];
  setPlugins: Dispatch<SetStateAction<TResourcePlugin[]>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  categories: PluginCategory[];
  toggleCategory: (category: PluginCategory) => void;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  updateSearch: () => void;
}

const FilterPluginContext = createContext<FilterPluginContextType | undefined>(
  undefined,
);

export function useFilterPluginContext() {
  const context = useContext(FilterPluginContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface FilterPluginProviderProps {
  children: ReactNode;
}

export function FilterPluginProvider({ children }: FilterPluginProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plugins, setPlugins] = useState<TResourcePlugin[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [categories, setCategories] = useState<
    (typeof pluginCategoriesConfig)[number][]
  >([]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategories(
      searchParams
        .getAll('category')
        .filter((category): category is PluginCategory =>
          pluginCategoriesConfig.includes(category as PluginCategory),
        ),
    );
    setLimit(Number.parseInt(searchParams.get('limit') || '10', 10));
    setPage(Number.parseInt(searchParams.get('page') || '0', 10));
  }, [searchParams]);

  async function performSearch() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    categories.forEach((category) => params.append('category', category));
    if (limit != 10) params.set('limit', limit.toString());
    if (page > 0) params.set('page', page.toString());

    router.push(`/resources?${params.toString()}`);

    const newPlugins = await resourcesFindAndFilter({
      limit,
      page,
      search,
      categories,
    });

    setPlugins(newPlugins.resources);
  }

  const searchDebound = useDebounce(search, 500);

  useEffect(() => {
    updateSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebound]);

  function updateSearch() {
    performSearch();
  }

  function toggleCategory(category: (typeof pluginCategoriesConfig)[number]) {
    setCategories((prev) =>
      prev.includes(category) ?
        prev.filter((c) => c !== category)
      : [...prev, category],
    );
  }

  return (
    <FilterPluginContext.Provider
      value={{
        plugins,
        setPlugins,
        search,
        setSearch,
        categories,
        toggleCategory,
        updateSearch,
        limit,
        setLimit,
        page,
        setPage,
      }}
    >
      {children}
    </FilterPluginContext.Provider>
  );
}
