'use client';

import { createContext, useContext, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { TResourceSortBy } from '@/features/resource-plugin/config/sort-by.config';
import { resourceFilterZod } from '@/features/resource-plugin/schemas/zod/resource-filter.zod';
import sortStringToValue from '@/features/resource-plugin/util/sort-string-to-value';
import { useDebounce } from '@/hooks/use-debounce';
import { useUpdateSearchParams } from '@/hooks/use-update-search-params';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface ResourceFilterContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  limit: number;
  setLimit: (newLimit: number) => void;
  page: number;
  setPage: (page: number) => void;
  sortBy: TResourceSortBy | undefined;
  setSortBy: (sortBy: TResourceSortBy | null | undefined) => void;
  searchDebounce: string;
  getParams: () => Record<string, string | string[] | null>;
}

const ResourceFilterContext = createContext<
  ResourceFilterContextType | undefined
>(undefined);

export function useResourceFilterContext() {
  const context = useContext(ResourceFilterContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface ResourceFilterProviderProps {
  children: ReactNode;
}

export function ResourceFilterProvider({
  children,
}: ResourceFilterProviderProps) {
  const searchParams = useSearchParams();

  const {
    limit,
    page,
    searchQuery: query,
    sortBy,
  } = resourceFilterZod.parse({
    limit: searchParams.get('limit'),
    page: searchParams.get('p'),
    sortBy: sortStringToValue(searchParams.get('sort')),
    searchQuery: searchParams.get('q'),
  });

  //Use State this search param data because we want to slightly delay the search bar
  const [searchQuery, setSearchQuery] = useState<string>(query);
  const updateSearchParams = useUpdateSearchParams();
  // const [limit, setLimitState] = useState<number>(parsedParams.limit);
  // const [sortBy, setSortByState] = useState<TResourceSortBy>(
  //   parsedParams.sortBy,
  // );
  // const [page, setPageState] = useState<number>(parsedParams.page);

  // const [page, setPage] = useState<number>(0);
  // const [searchQuery, setSearchQuery] = useState<string>('');

  function getParams(): { [key: string]: string | string[] | null } {
    const data = {
      q: searchQuery,
      p: page > 0 ? page.toString() : null,
      sort: sortBy != 'relevance' ? sortBy : null,
      limit: limit != 16 ? limit.toString() : null,
    };
    return data;
  }

  function setLimit(newLimit: number) {
    updateSearchParams({ limit: newLimit.toString() });
  }

  function setSortBy(newSort: TResourceSortBy | undefined | null) {
    updateSearchParams({
      sort: newSort && newSort != 'relevance' ? newSort : null,
    });
  }

  function setPage(page: number) {
    updateSearchParams({ p: page.toString() });
  }

  const searchDebounce = useDebounce(searchQuery, 500);

  return (
    <ResourceFilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        limit,
        setLimit,
        page,
        setPage,
        sortBy,
        setSortBy,
        searchDebounce,
        getParams,
      }}
    >
      {children}
    </ResourceFilterContext.Provider>
  );
}
