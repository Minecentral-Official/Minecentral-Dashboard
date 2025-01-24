import { CogIcon, ReceiptIcon, UserIcon } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';

const sidebarMenuConfig = [
  {
    name: 'Billing',
    url: '/dashboard/account/billing',
    icon: ReceiptIcon,
  },
  {
    name: 'Settings',
    url: '/dashboard/account/settings',
    icon: CogIcon,
  },
];

export default function SidebarAccount() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='account'
      title='Account'
      Icon={UserIcon}
      links={sidebarMenuConfig}
    />
  );
}
