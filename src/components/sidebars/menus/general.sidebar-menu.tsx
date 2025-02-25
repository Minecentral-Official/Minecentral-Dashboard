import { ReceiptIcon, TicketIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import SidebarAccount from '@/components/sidebars/menus/account.sidebar-menu';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';

export default function SidebarGeneral() {
  return (
    <SidebarGroupWrapper title='General'>
      {/* <SidebarGeneral />*/}
      <SidebarAccount />
      <SidebarLink Icon={TicketIcon} name='Tickets' url='/dashboard/tickets' />
      <SidebarLink
        Icon={ReceiptIcon}
        name='Invoices'
        url='/dashboard/invoices'
      />
    </SidebarGroupWrapper>
  );
}
