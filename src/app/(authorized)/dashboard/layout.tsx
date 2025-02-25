import { PropsWithChildren } from 'react';

import SidebarDashboardWrapper from '@/components/sidebars/dashboard.wrapper';
import { SidebarAdmin } from '@/components/sidebars/menus/admin.sidebar-menu';
import SidebarGeneral from '@/components/sidebars/menus/general.sidebar-menu';
import SidebarManage from '@/components/sidebars/menus/manage.sidebar-menu';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarDashboardWrapper
      sidebarChildren={
        <>
          <SidebarGeneral />
          <SidebarManage />
          {/* Will check if user is admin before displaying */}
          <SidebarAdmin />
        </>
      }
    >
      <div className='h-full w-full p-6'>{children}</div>
    </SidebarDashboardWrapper>
  );
}
