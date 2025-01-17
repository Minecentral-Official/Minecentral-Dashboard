import { CogIcon, ReceiptIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

const accountSidebarMenuConfig = [
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
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={'/dashboard/account'}>
            <UserIcon />
            <span>Account</span>
            {/* <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' /> */}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuSub>
          {accountSidebarMenuConfig.map(({ name, url, ...rest }) => (
            <SidebarMenuSubItem key={name}>
              <SidebarMenuSubButton asChild>
                <Link href={url}>
                  {rest.icon && <rest.icon />}
                  <span>{name}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// export default function HostAdminSidebarMenu() {
//   return (
//     <SidebarMenu>
//       {hostSidebarMenuConfig.map(({ name, url, ...rest }) => (
//         <Collapsible key={name} className='group/collapsible' asChild>
//           <SidebarMenuItem key={name}>
//             <CollapsibleTrigger asChild>
//               <SidebarMenuButton>
//                 {rest.icon && <rest.icon />}
//                 <span>{name}</span>
//                 <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
//               </SidebarMenuButton>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <SidebarMenuSub>
//                 <SidebarMenuSubItem>
//                   <SidebarMenuSubButton asChild>
//                     <a href='/asdf'>
//                       <span>test Item</span>
//                     </a>
//                   </SidebarMenuSubButton>
//                 </SidebarMenuSubItem>
//               </SidebarMenuSub>
//             </CollapsibleContent>
//           </SidebarMenuItem>
//         </Collapsible>
//       ))}
//     </SidebarMenu>
//   );
// }
