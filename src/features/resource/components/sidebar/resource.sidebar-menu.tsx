import { PlugIcon, PlusIcon } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Post Resource',
    url: '/dashboard/resource/new',
    icon: PlusIcon,
  },
];

export default function ResourceAccount() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='resource'
      Icon={PlugIcon}
      links={sidebarMenuConfig}
      title='Resources'
    />
  );
}
