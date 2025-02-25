import * as React from 'react';

import Link from 'next/link';

import LogoMark from '@/components/logos/logo-mark';
import { SidebarUser } from '@/components/sidebars/menus/user.sidebar-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import validateRole from '@/lib/auth/helpers/validate-role';

export async function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isAdmin = await validateRole('admin');
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard'>
                <div className='flex aspect-square size-8 items-center justify-center'>
                  <LogoMark className='size-8' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Minecentral</span>
                  <span className='truncate text-xs'>
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
