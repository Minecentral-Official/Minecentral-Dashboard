import { PropsWithChildren } from 'react';

import AdminSidebar from '@/components/sidebars/admin.sidebar-group';
import GeneralSidebar from '@/components/sidebars/general.sidebar-group';
import DashboardSidebar from '@/components/sidebars/sidebar.wrapper';
import HostSidebar from '@/features/host/components/sidebar/host.sidebar-group';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <DashboardSidebar
      sidebarChildren={
        <>
          <HostSidebar />
          <GeneralSidebar />
          <AdminSidebar />
          {/* Add Additional sidebar menus here */}
        </>
      }
    >
      <div className='p-6'>{children}</div>
    </DashboardSidebar>
  );
}
