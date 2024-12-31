'use client';

import { RiDiscordFill } from '@remixicon/react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/configs/auth.client';

export default function DiscordSocialSignIn() {
  return (
    <Button
      className='bg-[#7289da] text-white after:flex-1 hover:bg-[#7289da]/90'
      onClick={async () =>
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: '/dashboard',
        })
      }
    >
      <span className='pointer-events-none me-2 flex-1'>
        <RiDiscordFill className='opacity-60' size={16} aria-hidden='true' />
      </span>
      Login with Discord
    </Button>
  );
}
