import { PropsWithChildren } from 'react';

import AdminToggleButton from '@/components/buttons/admin.toggle';
import { Footer } from '@/components/footer';
import Header from '@/components/header/header';
import SidebarDashboardGeneral from '@/components/sidebars/menus/dashboard-general.sidebar-menu';
import SidebarDashboardManage from '@/components/sidebars/menus/dashboard-manage.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';
import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header config={baseNavigationConfig()} />
      <SidebarWrapper
        sidebar={
          <div className='flex h-full flex-col justify-between'>
            <div>
              <SidebarDashboardGeneral />
              <Separator />
              <SidebarDashboardManage />
            </div>
            <AdminToggleButton isOnAdmin={false} />
          </div>
        }
      >
        <div className='h-full w-full p-6 pt-20'>{children}</div>
      </SidebarWrapper>
      <Footer />
    </>
  );
}
