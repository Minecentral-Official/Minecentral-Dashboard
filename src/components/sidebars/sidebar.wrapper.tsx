import { PropsWithChildren, ReactNode } from 'react';

import DataBreadcrumbs from '@/components/breadcrumbs/data.breadcrumbs';
import { AppSidebar } from '@/components/sidebars/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function DashboardSidebar({
  children,
  sidebarChildren,
}: PropsWithChildren<{ sidebarChildren: ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar>{sidebarChildren}</AppSidebar>
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
