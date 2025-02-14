'use client';

import { createContext, useContext } from 'react';

import { TResourcePlugin } from '@/features/resource/types/plugin.type';

import type { ReactNode } from 'react';

interface PluginContextType {
  plugin: TResourcePlugin;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export function useResourcePluginContext() {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface ResourcePluginProviderProps extends PluginContextType {
  children: ReactNode;
}

export function ResourcePluginProvider({
  children,
  plugin,
}: ResourcePluginProviderProps) {
  return (
    <PluginContext.Provider value={{ plugin }}>
      {children}
    </PluginContext.Provider>
  );
}
