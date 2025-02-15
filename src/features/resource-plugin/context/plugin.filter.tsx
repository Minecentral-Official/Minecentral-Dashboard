'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import {
  pluginCategoriesConfig,
  PluginCategory,
} from '@/features/resource-plugin/config/categories.plugin';
import resourcesFindAndFilter from '@/features/resource-plugin/queries/resources-find.filter';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';
import { useDebounce } from '@/hooks/use-debounce';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface FilterPluginContextType {
  plugins: TResourcePlugin[] | undefined;
  setPlugins: Dispatch<SetStateAction<TResourcePlugin[] | undefined>>;
  search: string | undefined;
  setSearch: Dispatch<SetStateAction<string>>;
  categories: PluginCategory[] | undefined;
  toggleCategory: (category: PluginCategory) => void;
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
  const [plugins, setPlugins] = useState<TResourcePlugin[]>();
  const [search, setSearch] = useState<string>('');
  const [categories, setCategories] = useState<
    (typeof pluginCategoriesConfig)[number][]
  >([]);

  async function fetchPlugins() {
    const newPlugins = await resourcesFindAndFilter({
      limit: 10,
      page: 0,
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
    fetchPlugins();
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
      }}
    >
      {children}
    </FilterPluginContext.Provider>
  );
}
