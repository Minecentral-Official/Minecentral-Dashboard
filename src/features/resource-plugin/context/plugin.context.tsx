'use client';

import { createContext, useContext } from 'react';

import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';

import type { ReactNode } from 'react';

const PluginContext = createContext<TResourcePlugin | undefined>(undefined);

export function usePluginContext() {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface ResourcePluginProviderProps extends TResourcePlugin {
  children: ReactNode;
}

export function PluginProvider({
  children,
  ...rest
}: ResourcePluginProviderProps) {
  return (
    <PluginContext.Provider value={rest}>{children}</PluginContext.Provider>
  );
}
