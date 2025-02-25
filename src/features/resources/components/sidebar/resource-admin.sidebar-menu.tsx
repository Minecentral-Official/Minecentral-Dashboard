import { CpuIcon, PlugIcon, TestTube } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Servers',
    url: '/dashboard/admin/resource/servers',
    icon: CpuIcon,
  },
  {
    name: 'Nodes',
    url: '/dashboard/admin/resource/nodes',
    icon: TestTube,
  },
];

export default function SidebarResourceAdmin() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='admin'
      Icon={PlugIcon}
      title='Resources'
      links={sidebarMenuConfig}
    />
  );
}
