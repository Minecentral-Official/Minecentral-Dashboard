import { CogIcon, ReceiptIcon, TicketIcon, UserIcon } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';
import SidebarLink from '@/components/sidebars/link.sidebar';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';

export default function SidebarDashboardGeneral() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarDashboardAccount />
        <SidebarLink
          Icon={TicketIcon}
          name='Tickets'
          url='/dashboard/tickets'
        />
        <SidebarLink
          Icon={ReceiptIcon}
          name='Invoices'
          url='/dashboard/invoices'
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}

function SidebarDashboardAccount() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='account'
      title='Account'
      Icon={UserIcon}
      links={[
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
      ]}
    />
  );
}
