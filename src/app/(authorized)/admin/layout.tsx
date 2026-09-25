import { PropsWithChildren } from 'react';

import { Metadata } from 'next';

import AdminToggleButton from '@/components/buttons/admin.toggle';
import { SidebarAdminResources } from '@/components/sidebars/menus/admin-resources.sidebar-menu';
import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import SignOutButton from '@/lib/auth/components/buttons/sign-out.button';
import requirePermission from '@/lib/auth/helpers/require-permission';

export const metadata: Metadata = {
  title: 'Admin',
};

export default async function AdminGuard({ children }: PropsWithChildren) {
  await requirePermission('admin:access');
  return (
    <SidebarWrapper
      headerActions={<SignOutButton />}
      sidebar={
        <div className='flex h-full flex-col justify-between'>
          <div>
            <p className='font-semiborder-l-purple-800 pl-2 text-xl'>Admin</p>
            <SidebarAdminResources />
          </div>
          <AdminToggleButton isOnAdmin={true} />
        </div>
      }
    >
      <div className='h-full w-full pl-2'>{children}</div>
    </SidebarWrapper>
  );
}
