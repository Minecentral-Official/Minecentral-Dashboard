import { Server } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const hostSidebarMenuConfig = [
  {
    name: 'Servers',
    url: '/dashboard/host/servers',
    icon: Server,
  },
];

export default function HostSidebar() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>

      <SidebarGroupContent>
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
