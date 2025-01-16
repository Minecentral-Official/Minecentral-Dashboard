import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import type { PropsWithChildren } from 'react';

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

export default function AdminSidebar({ children }: PropsWithChildren) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      {children}
    </SidebarGroup>
  );
}
