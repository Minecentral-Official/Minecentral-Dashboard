import { PropsWithChildren } from 'react';

import { BotIcon } from 'lucide-react';

import SidebarDashboardWrapper from '@/components/sidebars/dashboard.wrapper';
import SidebarGeneral from '@/components/sidebars/general.sidebar-menu';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';
import SidebarLinkWrapper from '@/components/sidebars/wrapper.sidebar-link';
import SidebarHostAdmin from '@/features/host/components/sidebar/host-admin.sidebar-menu';
import HostSidebar from '@/features/host/components/sidebar/host.sidebar-group';
import ResourceSidebar from '@/features/resource/components/sidebar/resource.sidebar-menu';
import validateRole from '@/lib/auth/helpers/validate-role';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const isAdmin = await validateRole('admin');
  return (
    <SidebarDashboardWrapper
      sidebarChildren={
        <>
          <SidebarGroupWrapper title='Products'>
            <HostSidebar />
            <ResourceSidebar />
          </SidebarGroupWrapper>
          <SidebarGeneral />
          {isAdmin && (
            <SidebarGroupWrapper title='Admin'>
              <SidebarLinkWrapper
                Icon={BotIcon}
                name='Dashboard'
                url='/dashboard/admin'
              />
              <SidebarHostAdmin />
            </SidebarGroupWrapper>
          )}
          {/* Add Additional sidebar menus here */}
        </>
      }
    >
      <div className='h-full w-full p-6'>{children}</div>
    </SidebarDashboardWrapper>
  );
}
