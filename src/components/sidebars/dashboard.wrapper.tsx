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

export default function SidebarDashboardWrapper({
  children,
  sidebarChildren,
  className,
  homeUrl,
}: PropsWithChildren<{
  sidebarChildren: ReactNode;
  className?: string;
  homeUrl?: string;
}>) {
  return (
    <SidebarProvider className=''>
      <AppSidebar
        homeUrl={homeUrl}
        className={cn('sticky top-16 h-[93svh]', className)}
      >
        {sidebarChildren}
      </AppSidebar>
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
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
