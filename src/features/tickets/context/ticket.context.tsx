'use client';

import { createContext, useContext } from 'react';

import DTOTicket from '@/features/tickets/dto/ticket.dto';

import type { ReactNode } from 'react';

interface TicketContextType {
  ticket: ReturnType<typeof DTOTicket>;
}

const PluginContext = createContext<TicketContextType | undefined>(undefined);

export function useTicketContext() {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePluginContext must be used within a PluginProvider');
  }
  return context;
}

interface TicketProviderProps {
  children: ReactNode;
  ticket: ReturnType<typeof DTOTicket>;
}

export function TicketProvider({ children, ticket }: TicketProviderProps) {
  return (
    <PluginContext.Provider value={{ ticket }}>
      {children}
    </PluginContext.Provider>
  );
}
