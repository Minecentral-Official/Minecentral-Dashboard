'use client';

import { LogOut } from 'lucide-react';

import useSignOut from '@/auth/hooks/use-sign-out';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function SignOutDropdownMenuItem() {
  const { handleSignOut } = useSignOut();

  return (
    <DropdownMenuItem
      className='items-center text-red-500 focus:text-red-500'
      onClick={handleSignOut}
    >
      <LogOut />
      Sign Out
    </DropdownMenuItem>
  );
}
