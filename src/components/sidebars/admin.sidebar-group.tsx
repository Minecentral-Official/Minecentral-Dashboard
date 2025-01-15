import { ChevronDown, Server, TestTube } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const hostSidebarMenuConfig = [
  {
    name: 'Host Servers',
    url: '/dashboard/admin/host/server-list',
    icon: Server,
  },
  {
    name: 'Testing List',
    url: '/dashboard/',
    icon: TestTube,
  },
  {
    name: 'Testing List',
    url: '/dashboard/',
    icon: TestTube,
  },
];

//HUGO:
// I want each thing UNDER Admin to be collapseable
//Example
//Admin
//  Host
//    Servers
//    Users
//    Nodes
//  Plugins
//    ...

export default function AdminSidebar() {
  return (
    <Collapsible defaultOpen className='group/collapsible'>
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Admin
            <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarMenu>
            {hostSidebarMenuConfig.map(({ name, url, ...rest }) => (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton asChild>
                  <a href={url}>
                    <rest.icon />
                    <span>{name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
