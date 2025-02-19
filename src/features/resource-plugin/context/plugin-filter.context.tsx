'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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
import { PluginsGetResponseSchema } from '@/features/resource-plugin/schemas/zod/plugins-get-response.zod';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';
import {
  SearchParamsConsume,
  useUpdateSearchParams,
} from '@/hooks/use-update-search-params';

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
  const { searchDebounce, getParams } = useResourceFilterContext();

  const [plugins, setPlugins] = useState<TResourcePlugin[]>([]);
  const updateSearchParams = useUpdateSearchParams();
  const categories = searchParams
    .getAll('category')
    .filter((category): category is TPluginCategory =>
      TPluginCategories.includes(category as TPluginCategory),
    );
  const versions = searchParams
    .getAll('v')
    .filter((version): version is TPluginVersion =>
      TPluginVersions.includes(version as TPluginVersion),
    );

  useEffect(() => {
    // updateSearchParams({ q: searchQuery });
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

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
        const parse = PluginsGetResponseSchema.safeParse(json);
        if (parse.success) setPlugins(parse.data.resources);
        else {
          toast.error('Query error:' + parse.error);
        }
      });
  };

  //#region Togglers
  function toggleCategory(category: TPluginCategory) {
    const currentCategories = searchParams
      .getAll('category')
      .filter((category): category is TPluginCategory =>
        TPluginCategories.includes(category as TPluginCategory),
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
        TPluginVersions.includes(version as TPluginVersion),
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
