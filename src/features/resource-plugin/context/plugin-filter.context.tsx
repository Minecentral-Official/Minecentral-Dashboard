'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const { limit, page, searchQuery, searchDebounce, setParams } =
    useResourceFilterContext();

  const [plugins, setPlugins] = useState<TResourcePlugin[]>([]);
  const [categories, setCategories] = useState<TPluginCategory[]>([]);
  const [versions, setVersions] = useState<TPluginVersion[]>([]);
  const pathname = usePathname();
  const router = useRouter();

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
    console.log('Updated categories and versions');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // performSearch();
    async function getPlugins() {
      const params = new URLSearchParams();
      setParams(params);
      categories.forEach((category) => params.append('category', category));
      versions.forEach((version) => params.append('v', version));

      const result = await fetch(
        `/api/resources?q=${searchDebounce}&page=${page}`,
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  //Performs the search query, returning and updating the plugins to be shown to user
  const performSearch = async () => {
    updateParams();
    const newPlugins = await resourcesFindAndFilter({
      limit,
      page,
      query: searchQuery,
      categories,
    });

    setPlugins(newPlugins.resources);
  };

  function updateParams() {
    const params = new URLSearchParams();
    setParams(params);

    categories.forEach((category) => params.append('category', category));
    versions.forEach((version) => params.append('v', version));

    //Updates the clients navigation, but doesn't trigger get on server
    window.history.replaceState(null, '', `?${params.toString()}`);
    // router.replace(`/resources?${params.toString()}`, { scroll: true });
  }

  //#region Togglers
  function toggleCategory(category: TPluginCategory) {
    setCategories((prev) =>
      prev.includes(category) ?
        prev.filter((c) => c !== category)
      : [...prev, category],
    );

    const currentCategories = searchParams
      .getAll('category')
      .filter((category): category is TPluginCategory =>
        TPluginCategories.includes(category as TPluginCategory),
      );

    const newCategories =
      currentCategories.includes(category) ?
        currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('category');

    newCategories.forEach((category) => {
      newSearchParams.append('category', category);
    });
    router.push(pathname + '?' + newSearchParams.toString());
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
