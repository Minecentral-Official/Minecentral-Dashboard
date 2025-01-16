import { ReceiptIcon, UserIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const generalSidebarConfig = [
  {
    name: 'Invoices',
    url: '/dashboard/invoices',
    icon: ReceiptIcon,
  },
  { name: 'Account', url: '/dashboard/account', icon: UserIcon },
];

export default function GeneralSidebar() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {generalSidebarConfig.map(({ name, url, ...rest }) => (
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
