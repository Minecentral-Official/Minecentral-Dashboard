import { ChevronsUpDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import AuthNav from '@/lib/auth/components/dropdowns/auth.dropdown';
import getSession from '@/lib/auth/helpers/get-session';

export async function SidebarUser() {
  const session = await getSession();

  if (!session) {
    throw new Error('User not found');
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AuthNav className=''>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name}
              />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {session.user.name}
              </span>
              <span className='truncate text-xs'>{session.user.email}</span>
            </div>
            <ChevronsUpDown className='ml-auto size-4' />
          </SidebarMenuButton>
        </AuthNav>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
