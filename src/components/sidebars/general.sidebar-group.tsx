import { Receipt } from 'lucide-react';

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
    name: 'Invoices',
    url: '/dashboard/invoices',
    icon: Receipt,
  },
];

export default function GeneralSidebar() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>

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
