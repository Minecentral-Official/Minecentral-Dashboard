import { CogIcon, ReceiptIcon, TicketIcon, UserIcon } from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';
import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';

export default function SidebarDashboardGeneral() {
  return (
    <SidebarGroupWrapper title='General'>
      {/* <SidebarGeneral />*/}
      <SidebarDashboardAccount />
      <SidebarLink Icon={TicketIcon} name='Tickets' url='/dashboard/tickets' />
      <SidebarLink
        Icon={ReceiptIcon}
        name='Invoices'
        url='/dashboard/invoices'
      />
    </SidebarGroupWrapper>
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
