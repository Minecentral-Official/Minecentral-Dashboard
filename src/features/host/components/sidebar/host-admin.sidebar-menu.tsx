import { Server, ServerIcon, TestTube } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Servers',
    url: '/dashboard/admin/host/server-list',
    icon: Server,
  },
  {
    name: 'Testing List',
    url: '/dashboard',
    icon: TestTube,
  },
];

export default function SidebarHostAdmin() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='admin'
      Icon={ServerIcon}
      title='Host'
      links={sidebarMenuConfig}
    />
  );
}
