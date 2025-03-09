import { PropsWithChildren } from 'react';

import SidebarDashboardGeneral from '@/components/sidebars/menus/dashboard-general.sidebar-menu';
import SidebarDashboardManage from '@/components/sidebars/menus/dashboard-manage.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SidebarWrapper
        sidebar={
          <div className='flex h-full flex-col justify-between'>
            <div>
              <SidebarDashboardGeneral />
              <Separator />
              <SidebarDashboardManage />
            </div>
            {/* <Suspense>
              <AdminToggleButton isOnAdmin={false} />
            </Suspense> */}
          </div>
        }
      >
        <div className='h-full w-full px-4'>{children}</div>
      </SidebarWrapper>
    </>
  );
}
