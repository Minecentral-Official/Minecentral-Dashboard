import { DatabaseIcon, ServerIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';

export async function SidebarAdminHosting() {
  return (
    <SidebarGroup className='pt-1'>
      <SidebarMenu>
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
      </SidebarMenu>
    </SidebarGroup>
  );
}
