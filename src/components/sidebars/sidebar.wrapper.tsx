import { PropsWithChildren, ReactNode } from 'react';

import DataBreadcrumbs from '@/components/breadcrumbs/data.breadcrumbs';
import { AppSidebar } from '@/components/sidebars/app.sidebar';
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
    <SidebarProvider className='bg-none'>
      <AppSidebar
        className={cn(
          'my-0', //top-[100px] h-[calc(100svh-100px)] xl:top-[80px] xl:h-[calc(100svh-80px)]',
          'relative rounded-md bg-sidebar',
          className,
        )}
      >
        {sidebar}
      </AppSidebar>
      <SidebarInset className='md:pl-4'>
        <header className='flex shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='md:hidden' />
            <DataBreadcrumbs />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
