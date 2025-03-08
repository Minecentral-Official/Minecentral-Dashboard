import { PropsWithChildren, ReactNode } from 'react';

import DataBreadcrumbs from '@/components/breadcrumbs/data.breadcrumbs';
import { AppSidebar } from '@/components/sidebars/app.sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function SidebarWrapper({
  children,
  sidebar,
  className,
}: PropsWithChildren<{
  sidebar: ReactNode;
  className?: string;
}>) {
  return (
    <SidebarProvider className='gap-2 bg-none'>
      <AppSidebar
        className={cn(
          'sticky top-20 h-[calc(100svh-5rem)]',
          'bg-sidebar',
          className,
        )}
      >
        {sidebar}
      </AppSidebar>
      <SidebarInset className='bg-none pt-2'>
        <header className='flex shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <DataBreadcrumbs />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
