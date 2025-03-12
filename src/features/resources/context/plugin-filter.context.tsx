'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';
import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import {
  ResourceFilterProvider,
  useResourceFilterContext,
} from '@/features/resources/context/resource-filter.context';
import { S_ResourceResponse } from '@/features/resources/schemas/zod/s-resource-api-responses.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';
import { TPluginVersion } from '@/features/resources/types/t-resource-version-support.type';
import {
  SearchParamsConsume,
  useUpdateSearchParams,
} from '@/hooks/use-update-search-params';

import type { ReactNode } from 'react';

interface PluginFilterContextType {
  plugins: T_DTOResource[];
  categories: T_PluginCategory[];
  toggleCategory: (category: T_PluginCategory) => void;
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
  const categories = searchParams
    .getAll('category')
    .filter((category): category is T_PluginCategory =>
      C_CategoriesPlugin.includes(category as T_PluginCategory),
    );
  const versions = searchParams
    .getAll('v')
    .filter((version): version is TPluginVersion =>
      C_GameVersions.includes(version as TPluginVersion),
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
    categories.forEach((category) => params.append('category', category));
    versions.forEach((version) => params.append('v', version));

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
      .getAll('category')
      .filter((category): category is T_PluginCategory =>
        C_CategoriesPlugin.includes(category as T_PluginCategory),
      );

    const newCategories =
      currentCategories.includes(category) ?
        currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updateSearchParams({
      category: newCategories.map((cat) => cat),
    });
  }

  function toggleVersions(version: TPluginVersion) {
    const currentVersions = searchParams
      .getAll('v')
      .filter((version): version is TPluginVersion =>
        C_GameVersions.includes(version as TPluginVersion),
      );

    const newVersions =
      currentVersions.includes(version) ?
        currentVersions.filter((c) => c !== version)
      : [...currentVersions, version];

    updateSearchParams({
      v: newVersions.map((cat) => cat),
    });
  }
  //#endregion

  return (
    <FilterPluginContext.Provider
      value={{
        plugins,
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
