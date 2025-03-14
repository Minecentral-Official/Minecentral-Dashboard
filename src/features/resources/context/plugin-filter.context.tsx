'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';
import { C_PluginLoaders } from '@/features/resources/config/c-plugin-loaders.plugin';
import {
  ResourceFilterProvider,
  useResourceFilterContext,
} from '@/features/resources/context/resource-filter.context';
import { S_ResourceResponse } from '@/features/resources/schemas/zod/s-resource-api-responses.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';
import { T_PluginLoader } from '@/features/resources/types/t-plugin-loader.type';
import {
  SearchParamsConsume,
  useUpdateSearchParams,
} from '@/hooks/use-update-search-params';
import { C_GameVersions } from '@/lib/configs/c-game-versions.config';
import { T_GameVersion } from '@/lib/types/t-game-version.type';

import type { ReactNode } from 'react';

interface PluginFilterContextType {
  plugins: T_DTOResource[];
  categories: T_PluginCategory[];
  toggleCategory: (category: T_PluginCategory) => void;
  versions: T_GameVersion[];
  toggleVersions: (version: T_GameVersion) => void;
  loaders: T_PluginLoader[];
  toggleLoaders: (loader: T_PluginLoader) => void;
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
    <ResourceFilterProvider searchType='plugin'>
      <FilterPluginWrapper>{children}</FilterPluginWrapper>
    </ResourceFilterProvider>
  );
}

function FilterPluginWrapper({ children }: FilterPluginProviderProps) {
  const searchParams = useSearchParams();
  const { searchDebounce, getParams, setTotalPages } =
    useResourceFilterContext();

  const [plugins, setPlugins] = useState<T_DTOResource[]>([]);
  const updateSearchParams = useUpdateSearchParams();
  const filterCategories = searchParams
    .getAll('c')
    .filter((category): category is T_PluginCategory =>
      C_PluginCategories.includes(category as T_PluginCategory),
    );
  const filterVersions = searchParams
    .getAll('v')
    .filter((version): version is T_GameVersion =>
      C_GameVersions.includes(version as T_GameVersion),
    );
  const filterLoaders = searchParams
    .getAll('l')
    .filter((loader): loader is T_PluginLoader =>
      C_PluginLoaders.includes(loader as T_PluginLoader),
    );

  useEffect(() => {
    // updateSearchParams({ q: searchQuery });
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, searchParams]);

  //Performs the search query, returning and updating the plugins to be shown to user
  const performSearch = async () => {
    const params = new URLSearchParams();
    SearchParamsConsume(params, getParams());
    filterCategories.forEach((category) => params.append('c', category));
    filterVersions.forEach((version) => params.append('v', version));
    filterLoaders.forEach((loader) => params.append('l', loader));

    fetch(`/api/resources?${params.toString()}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const parse = S_ResourceResponse.safeParse(json);
        if (parse.success) {
          setPlugins(parse.data.resources);
          setTotalPages(parse.data.totalPages);
        } else {
          console.log(parse.error);
          toast.error('Could not fetch data, please contact an admin!');
        }
      });
  };

  //#region Togglers
  function toggleCategory(category: T_PluginCategory) {
    const currentCategories = searchParams
      .getAll('c')
      .filter((category): category is T_PluginCategory =>
        C_PluginCategories.includes(category as T_PluginCategory),
      );

    const newCategories =
      currentCategories.includes(category) ?
        currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updateSearchParams({
      c: newCategories.map((cat) => cat),
    });
  }

  function toggleVersions(version: T_GameVersion) {
    const currentVersions = searchParams
      .getAll('v')
      .filter((version): version is T_GameVersion =>
        C_GameVersions.includes(version as T_GameVersion),
      );

    const newVersions =
      currentVersions.includes(version) ?
        currentVersions.filter((c) => c !== version)
      : [...currentVersions, version];

    updateSearchParams({
      v: newVersions.map((cat) => cat),
    });
  }

  function toggleLoaders(loader: T_PluginLoader) {
    const currentLoaders = searchParams
      .getAll('l')
      .filter((loader): loader is T_PluginLoader =>
        C_PluginLoaders.includes(loader as T_PluginLoader),
      );

    const newLoaders =
      currentLoaders.includes(loader) ?
        currentLoaders.filter((l) => l !== loader)
      : [...currentLoaders, loader];

    updateSearchParams({
      l: newLoaders.map((cat) => cat),
    });
  }
  //#endregion

  return (
    <FilterPluginContext.Provider
      value={{
        plugins,
        categories: filterCategories,
        toggleCategory,
        versions: filterVersions,
        toggleVersions,
        loaders: filterLoaders,
        toggleLoaders,
        performSearch,
      }}
    >
      {children}
    </FilterPluginContext.Provider>
  );
}
