import { PropsWithChildren } from 'react';

import SidebarDashboardWrapper from '@/components/sidebars/dashboard.wrapper';
import SidebarGeneral from '@/components/sidebars/general.sidebar-menu';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';
import SidebarHostAdmin from '@/features/host/components/sidebar/host-admin.sidebar-menu';
import HostSidebar from '@/features/host/components/sidebar/host.sidebar-group';
import PluginsSidebar from '@/features/plugins/components/sidebar/plugins.sidebar-group';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarDashboardWrapper
      sidebarChildren={
        <>
          <SidebarGroupWrapper title='Products'>
            <HostSidebar />
            <PluginsSidebar />
          </SidebarGroupWrapper>
          <SidebarGeneral />
          <SidebarGroupWrapper title='Admin'>
            <SidebarHostAdmin />
          </SidebarGroupWrapper>
          {/* Add Additional sidebar menus here */}
        </>
      }
    >
      <div className='h-full w-full p-6'>{children}</div>
    </SidebarDashboardWrapper>
  );
}
