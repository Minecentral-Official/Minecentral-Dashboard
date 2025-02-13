import { PlugIcon, PlusIcon } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Post Resource',
    url: '/dashboard/resources/create',
    icon: PlusIcon,
  },
];

export default function ResourceAccount() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='resources'
      Icon={PlugIcon}
      links={sidebarMenuConfig}
      title='Resources'
    />
  );
}
