import { DatabaseIcon, ServerIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';

export async function SidebarAdminHosting() {
  return (
    <SidebarGroupWrapper title='Hosting'>
      <SidebarLink
        Icon={DatabaseIcon}
        name='Nodes'
        url='/admin/hosting/nodes'
      />
      <SidebarLink
        Icon={ServerIcon}
        name='Servers'
        url='/admin/hosting/servers'
      />
    </SidebarGroupWrapper>
  );
}
