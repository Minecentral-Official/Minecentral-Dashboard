import * as React from 'react';

import Link from 'next/link';

import LogoMark from '@/components/logos/logo-mark';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export async function AppSidebar(
  {
    children,
    // homeUrl,
    ...props
  }: React.ComponentProps<typeof Sidebar>,
  //  & { homeUrl?: string }
) {
  // const isAdmin = await validateRole('admin');
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader className='md:hidden'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={'/dashboard'}>
                <div className='flex aspect-square size-8 items-center justify-center'>
                  <LogoMark className='size-8' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Minecentral</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      {/* <SidebarFooter>
        <SidebarUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
