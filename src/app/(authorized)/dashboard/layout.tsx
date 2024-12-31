import { PropsWithChildren } from 'react';

import DashboardSidebar from '@/components/sidebars/sidebar.wrapper';
import HostSidebar from '@/features/host/components/sidebar/host.sidebar-group';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <DashboardSidebar
      sidebarChildren={
        <>
          <HostSidebar />
          {/* Add Additional sidebar menus here */}
        </>
      }
    >
      {children}
    </DashboardSidebar>
  );
}
