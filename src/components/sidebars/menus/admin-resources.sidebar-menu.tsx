import { NotebookIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';

export async function SidebarAdminResources() {
  return (
    <SidebarGroup className='py-1'>
      <SidebarMenu>
        <SidebarLink
          Icon={NotebookIcon}
          name='All Projects'
          url='/admin/resources'
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
