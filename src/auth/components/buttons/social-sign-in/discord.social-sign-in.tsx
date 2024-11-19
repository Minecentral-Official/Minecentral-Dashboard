'use client';

import { authClient } from '@/auth/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function DiscordSocialSignIn() {
  return (
    <Button
      onClick={async () =>
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: '/dashboard',
        })
      }
    >
      Discord
    </Button>
  );
}
