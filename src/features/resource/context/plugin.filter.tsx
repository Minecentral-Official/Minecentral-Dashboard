'use client';

import { createContext, useContext, useState } from 'react';

import { TResourcePlugin } from '@/features/resource/types/plugin.type';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface FilterPluginContextType {
  plugins: TResourcePlugin[] | undefined;
  setPlugins: Dispatch<SetStateAction<TResourcePlugin[] | undefined>>;
  search: string | undefined;
  setSearch: Dispatch<SetStateAction<string | undefined>>;
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
  const [search, setSearch] = useState<string>();
  const [categories, setCategories] = useState<string>();

  return (
    <FilterPluginContext.Provider
      value={{ plugins, setPlugins, search, setSearch }}
    >
      {children}
    </FilterPluginContext.Provider>
  );
}
