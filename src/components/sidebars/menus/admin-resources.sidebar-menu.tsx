import { NotebookIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';

export async function SidebarAdminResources() {
  return (
    <SidebarGroupWrapper title='Resources'>
      <SidebarLink
        Icon={NotebookIcon}
        name='All Projects'
        url='/admin/resources'
      />
    </SidebarGroupWrapper>
  );
}
