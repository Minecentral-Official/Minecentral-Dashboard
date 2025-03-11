import { PropsWithChildren } from 'react';

import AdminToggleButton from '@/components/buttons/admin.toggle';
import SidebarDashboardGeneral from '@/components/sidebars/menus/dashboard-general.sidebar-menu';
import SidebarDashboardManage from '@/components/sidebars/menus/dashboard-manage.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';

export async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarWrapper
      sidebar={
        <div className='flex h-full flex-col justify-between'>
          <div>
            <p className='font-semiborder-l-purple-800 pl-2 text-xl'>
              Dashboard
            </p>
            <SidebarDashboardGeneral />
            <Separator />
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
