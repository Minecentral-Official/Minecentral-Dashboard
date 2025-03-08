import { PropsWithChildren } from 'react';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import AdminToggleButton from '@/components/buttons/admin.toggle';
import { SidebarAdminHosting } from '@/components/sidebars/menus/admin-hosting.sidebar-menu copy';
import { SidebarAdminResources } from '@/components/sidebars/menus/admin-resources.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import validateRole from '@/lib/auth/helpers/validate-role';

export const metadata: Metadata = {
  title: 'Admin',
};

export default async function AdminGuard({ children }: PropsWithChildren) {
  if (!(await validateRole('admin'))) {
    return redirect('/dashboard');
  }
  return (
    <SidebarWrapper
      sidebar={
        <div className='flex h-full flex-col justify-between'>
          <div>
            <SidebarAdminResources />
            <SidebarAdminHosting />
          </div>
          <AdminToggleButton isOnAdmin={true} />
        </div>
      }
    >
      <div className='h-full w-full p-6'>{children}</div>
    </SidebarWrapper>
  );
}
