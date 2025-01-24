'use client';

import { PropsWithChildren } from 'react';

import { usePathname } from 'next/navigation';

import { Collapsible } from '@/components/ui/collapsible';
import { SidebarMenu } from '@/components/ui/sidebar';

export default function CollapsibleClientWrapper({
  children,
  urlSuffix,
}: PropsWithChildren & { urlSuffix: string }) {
  const pathname = usePathname();

  //Keeps the sidebar un-collapsible if inside any sub pages
  const path = pathname.split('/');

  const stayOpen = path.length >= 3 && path[2] === urlSuffix;
  return (
    <SidebarMenu>
      <Collapsible
        className='group/collapsible'
        open={stayOpen || undefined}
        asChild
      >
        {children}
      </Collapsible>
    </SidebarMenu>
  );
}
