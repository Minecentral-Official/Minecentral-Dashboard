import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export default function TicketsSidebarMenu() {
  return (
    <SidebarMenu>
      <Collapsible className='group/collapsible' asChild>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <span>Host</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {/* this file isnt used for anything currently, commenting this out to satisfy typescript for builds */}
          {/* <CollapsibleContent>
            <SidebarMenuSub>
              {hostSidebarMenuConfig.map(({ name, url, ...rest }) => (
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
          </CollapsibleContent> */}
        </SidebarMenuItem>
      </Collapsible>
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
