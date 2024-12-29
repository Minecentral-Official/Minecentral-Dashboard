'use client';

import { PropsWithChildren } from 'react';

import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';

export default function ResponsiveDropdownMenuContent({
  children,
}: PropsWithChildren) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenuContent
      className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
      side={isMobile ? 'bottom' : 'right'}
      align='end'
      sideOffset={4}
    >
      {children}
    </DropdownMenuContent>
  );
}
