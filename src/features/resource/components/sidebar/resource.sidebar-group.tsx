import { PlugIcon, PlusIcon } from 'lucide-react';
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
    name: 'Post Resource',
    url: '/dashboard/resource/new',
    icon: PlusIcon,
  },
];

export default function ResourceAccount() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={'/dashboard/resource'}>
            <PlugIcon />
            <span>Resources</span>
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
