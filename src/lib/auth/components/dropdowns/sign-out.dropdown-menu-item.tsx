'use client';

import { LogOut } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import useSignOut from '@/lib/auth/hooks/use-sign-out';

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
