'use client';

import React, { createContext, useContext } from 'react';

import { TResourcePlugin } from '@/features/resource/types/plugin.type';

import type { ReactNode } from 'react';

interface PluginContextType {
  plugins: TResourcePlugin[];
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export function useResourcePluginContext() {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface ResourcePluginProviderProps {
  children: ReactNode;
  init: TResourcePlugin[];
}

export function ResourcePluginProvider({
  children,
  init,
}: ResourcePluginProviderProps) {
  const [plugins] = React.useState(init);

  return (
    <PluginContext.Provider value={{ plugins }}>
      {children}
    </PluginContext.Provider>
  );
}
