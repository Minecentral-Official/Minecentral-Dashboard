import { ReceiptIcon, TicketIcon } from 'lucide-react';

import SidebarAccount from '@/components/sidebars/account.sidebar-menu';
import SidebarGroupWrapper from '@/components/sidebars/wrapper.sidebar-group';
import SidebarLinkWrapper from '@/components/sidebars/wrapper.sidebar-link';

export default function SidebarGeneral() {
  return (
    <SidebarGroupWrapper title='General'>
      {/* <SidebarGeneral />*/}
      <SidebarAccount />
      <SidebarLinkWrapper
        Icon={TicketIcon}
        name='Tickets'
        url='/dashboard/tickets'
      />
      <SidebarLinkWrapper
        Icon={ReceiptIcon}
        name='Invoices'
        url='/dashboard/invoices'
      />
    </SidebarGroupWrapper>
    // <SidebarGroupContent>
    //   <SidebarMenu>
    //     {generalSidebarConfig.map(({ name, url, ...rest }) => (
    //       <SidebarMenuItem key={name}>
    //         <SidebarMenuButton asChild>
    //           <a href={url}>
    //             <rest.icon />
    //             <span>{name}</span>
    //           </a>
    //         </SidebarMenuButton>
    //       </SidebarMenuItem>
    //     ))}
    //   </SidebarMenu>
    // </SidebarGroupContent>
  );
}
