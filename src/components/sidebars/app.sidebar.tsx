import * as React from 'react';

import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

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
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href={homeUrl || '/dashboard'}>
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
      </SidebarHeader> */}
      <SidebarContent>{children}</SidebarContent>
      {/* <SidebarFooter>
        <SidebarUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
