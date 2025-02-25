import { LayoutListIcon, ServerIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';

export default function SidebarManage() {
  return (
    <SidebarGroupWrapper title='Manage'>
      <SidebarLink
        Icon={LayoutListIcon}
        name='Resources'
        url='/dashboard/resources'
      />
      <SidebarLink
        Icon={ServerIcon}
        name='My Servers'
        url='/dashboard/hosting'
      />
    </SidebarGroupWrapper>
  );
}
