'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useDebounce } from '@/hooks/use-debounce';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface ResourceFilterContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  searchDebounce: string;
  setParams: (params: URLSearchParams) => void;
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

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  function setParams(params: URLSearchParams) {
    if (searchQuery) params.set('q', searchQuery);
    if (limit != 10) params.set('limit', limit.toString());
    if (page > 0) params.set('p', page.toString());
  }

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setLimit(Number.parseInt(searchParams.get('limit') || '10', 10));
    setPage(Number.parseInt(searchParams.get('p') || '0', 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        searchDebounce,
        setParams,
      }}
    >
      {children}
    </ResourceFilterContext.Provider>
  );
}
