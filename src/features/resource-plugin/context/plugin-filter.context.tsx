'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  TPluginCategories,
  TPluginCategory,
} from '@/features/resource-plugin/config/categories.plugin';
import {
  TPluginVersion,
  TPluginVersions,
} from '@/features/resource-plugin/config/versions.plugin';
import {
  ResourceFilterProvider,
  useResourceFilterContext,
} from '@/features/resource-plugin/context/resource-filter.context';
import resourcesFindAndFilter from '@/features/resource-plugin/queries/resources-find.filter';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface PluginFilterContextType {
  plugins: TResourcePlugin[];
  setPlugins: Dispatch<SetStateAction<TResourcePlugin[]>>;
  categories: TPluginCategory[];
  toggleCategory: (category: TPluginCategory) => void;
  versions: TPluginVersion[];
  toggleVersions: (version: TPluginVersion) => void;
  performSearch: () => void;
}

const FilterPluginContext = createContext<PluginFilterContextType | undefined>(
  undefined,
);

export function usePluginFilterContext() {
  const context = useContext(FilterPluginContext);
  if (context === undefined) {
    throw new Error(
      'usePluginFilterContext must be used within a PluginFilterContext.Provider',
    );
  }
  return context;
}

interface FilterPluginProviderProps {
  children: ReactNode;
}

export function PluginFilterProvider({ children }: FilterPluginProviderProps) {
  return (
    <ResourceFilterProvider>
      <FilterPluginWrapper>{children}</FilterPluginWrapper>
    </ResourceFilterProvider>
  );
}

function FilterPluginWrapper({ children }: FilterPluginProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { limit, page, searchQuery, searchDebounce, setParams } =
    useResourceFilterContext();

  const [plugins, setPlugins] = useState<TResourcePlugin[]>([]);
  const [categories, setCategories] = useState<TPluginCategory[]>([]);
  const [versions, setVersions] = useState<TPluginVersion[]>([]);

  //Whenever we load up, set the new categories
  useEffect(() => {
    setCategories(
      searchParams
        .getAll('category')
        .filter((category): category is TPluginCategory =>
          TPluginCategories.includes(category as TPluginCategory),
        ),
    );

    setVersions(
      searchParams
        .getAll('v')
        .filter((version): version is TPluginVersion =>
          TPluginVersions.includes(version as TPluginVersion),
        ),
    );
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Performs the search query, returning and updating the plugins to be shown to user
  async function performSearch() {
    const newPlugins = await resourcesFindAndFilter({
      limit,
      page,
      query: searchQuery,
      categories,
    });

    setPlugins(newPlugins.resources);
  }

  useEffect(() => {
    updateParams();
  }, [limit, page, searchQuery, versions, categories]);

  function updateParams() {
    const params = new URLSearchParams();
    setParams(params);

    categories.forEach((category) => params.append('category', category));
    versions.forEach((version) => params.append('v', version));

    router.push(`/resources?${params.toString()}`, { scroll: true });
  }

  //#region Togglers
  function toggleCategory(category: TPluginCategory) {
    setCategories((prev) =>
      prev.includes(category) ?
        prev.filter((c) => c !== category)
      : [...prev, category],
    );
  }

  function toggleVersions(version: TPluginVersion) {
    setVersions((prev) =>
      prev.includes(version) ?
        prev.filter((c) => c !== version)
      : [...prev, version],
    );
  }
  //#endregion

  return (
    <FilterPluginContext.Provider
      value={{
        plugins,
        setPlugins,
        categories,
        toggleCategory,
        versions,
        toggleVersions,
        performSearch,
      }}
    >
      {children}
    </FilterPluginContext.Provider>
  );
}
