'use client';

import { LogOut } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import useSignOut from '@/lib/auth/hooks/use-sign-out';

export default function SignOutDropdownMenuItem() {
  const { handleSignOut, pending } = useSignOut();

  return (
    <DropdownMenuItem
      className='items-center text-red-500 hover:cursor-pointer focus:text-red-500'
      disabled={pending}
      onSelect={(event) => {
        event.preventDefault();
        void handleSignOut();
      }}
    >
      <LogOut />
      {pending ? 'Signing out…' : 'Sign out'}
    </DropdownMenuItem>
  );
}
