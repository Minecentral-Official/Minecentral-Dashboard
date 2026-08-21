import { PropsWithChildren } from 'react';

import AdminToggleButton from '@/components/buttons/admin.toggle';
import LogoMark from '@/components/logos/logo-mark';
import SidebarDashboardGeneral from '@/components/sidebars/menus/dashboard-general.sidebar-menu';
import SidebarDashboardManage from '@/components/sidebars/menus/dashboard-manage.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';

export async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarWrapper
      sidebar={
        <div className='flex h-full flex-col justify-between p-2'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3 border-b px-2 pb-4 pt-2'>
              <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-background'>
                <LogoMark className='size-7' />
              </div>
              <div className='min-w-0'>
                <p className='truncate text-lg font-semibold'>Dashboard</p>
                <p className='truncate text-xs text-muted-foreground'>
                  Minecentral
                </p>
              </div>
            </div>
            <SidebarDashboardGeneral />
            <Separator className='my-2' />
            <SidebarDashboardManage />
          </div>
          <AdminToggleButton isOnAdmin={false} />
        </div>
      }
    >
      <div className='h-full w-full px-4'>{children}</div>
    </SidebarWrapper>
  );
}
