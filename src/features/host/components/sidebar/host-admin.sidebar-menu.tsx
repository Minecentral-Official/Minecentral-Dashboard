import { CpuIcon, ServerIcon, TestTube } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Servers',
    url: '/dashboard/admin/host/servers',
    icon: CpuIcon,
  },
  {
    name: 'Nodes',
    url: '/dashboard/admin/host/nodes',
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
