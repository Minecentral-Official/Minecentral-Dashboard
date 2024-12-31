'use client';

import { RiGithubFill } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/configs/auth.client';

export default function GithubSocialSignIn() {
  return (
    <Button
      className='bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90'
      onClick={async () =>
        await authClient.signIn.social({
          provider: 'github',
          callbackURL: '/dashboard',
        })
      }
    >
      <span className='pointer-events-none me-2 flex-1'>
        <RiGithubFill className='opacity-60' size={16} aria-hidden='true' />
      </span>
      Login with GitHub
    </Button>
  );
}
