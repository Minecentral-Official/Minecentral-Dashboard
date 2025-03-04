/* eslint-disable boundaries/element-types */
import { LayoutListIcon, TerminalIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';
import SidebarHostAdmin from '@/features/host/components/sidebar/host-admin.sidebar-menu';
import validateRole from '@/lib/auth/helpers/validate-role';

export async function SidebarAdmin() {
  const isAdmin = await validateRole('admin');
  if (!isAdmin) return <></>;
  return (
    <SidebarGroupWrapper title='Admin'>
      <SidebarLink
        Icon={TerminalIcon}
        name='Dashboard'
        url='/dashboard/admin'
      />
      <SidebarLink
        Icon={LayoutListIcon}
        name='Resources'
        url='/dashboard/admin/resources'
      />
      <SidebarHostAdmin />
    </SidebarGroupWrapper>
  );
}
