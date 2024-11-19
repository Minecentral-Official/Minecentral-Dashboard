'use client';

import { authClient } from '@/auth/lib/auth-client';
import { Button } from '@/components/ui/button';

export default function GithubSocialSignIn() {
  return (
    <Button
      onClick={async () =>
        await authClient.signIn.social({
          provider: 'github',
          callbackURL: '/dashboard',
        })
      }
    >
      Github
    </Button>
  );
}
