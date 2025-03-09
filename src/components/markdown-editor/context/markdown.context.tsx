'use client';

import { createContext, useContext, useState } from 'react';

import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface PluginFilterContextType {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
  openImage: boolean;
  setOpenImage: Dispatch<SetStateAction<boolean>>;
}

const MarkdownContext = createContext<PluginFilterContextType | undefined>(
  undefined,
);

export function useMarkdown() {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error(
      'usePluginFilterContext must be used within a PluginFilterContext.Provider',
    );
  }
  return context;
}

interface FilterPluginProviderProps {
  children: ReactNode;
  initialMarkdown?: string;
}

export function MarkdownProvider({
  children,
  initialMarkdown,
}: FilterPluginProviderProps) {
  const [markdown, setMarkdown] = useState(initialMarkdown || '');
  const [openImage, setOpenImage] = useState(false);

  return (
    <MarkdownContext.Provider
      value={{
        markdown,
        setMarkdown,
        openImage,
        setOpenImage,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
}
