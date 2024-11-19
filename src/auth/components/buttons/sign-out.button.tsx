'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/auth/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant='destructive'
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/sign-in');
            },
          },
        })
      }
    >
      Sign Out
    </Button>
  );
}
