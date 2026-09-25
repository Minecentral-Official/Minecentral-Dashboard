'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useSignOut from '@/lib/auth/hooks/use-sign-out';

export default function SignOutButton() {
  const { handleSignOut, pending } = useSignOut();
  return (
    <Button
      variant='outline'
      size='sm'
      className='shrink-0'
      disabled={pending}
      onClick={handleSignOut}
    >
      <LogOut aria-hidden='true' />
      {pending ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
