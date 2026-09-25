'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/configs/auth.client';
import { safeReturnPath } from '@/lib/auth/helpers/safe-return-path';

type Provider = 'discord' | 'github';
export default function SignInForm({
  providers,
  returnTo = '/dashboard',
  failed = false,
}: {
  providers: Provider[];
  returnTo?: string;
  failed?: boolean;
}) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState(
    failed ?
      'Sign-in was canceled or could not be completed. Please try again.'
    : '',
  );
  async function signIn(provider: Provider) {
    setError('');
    setPending(provider);
    try {
      const callbackURL = safeReturnPath(returnTo);
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
        errorCallbackURL: `/sign-in?error=oauth&returnTo=${encodeURIComponent(callbackURL)}`,
      });
      if (result.error) {
        setError('Sign-in could not be started. Please try again.');
        setPending(null);
      }
    } catch {
      setError('Unable to reach sign-in. Please try again.');
      setPending(null);
    }
  }
  return (
    <div className='flex flex-col gap-2'>
      {error && (
        <p role='alert' className='text-sm text-destructive'>
          {error}
        </p>
      )}
      {providers.length === 0 && (
        <p role='status'>Sign-in is not configured for this environment.</p>
      )}
      {providers.map((provider) => (
        <Button
          key={provider}
          disabled={pending !== null}
          onClick={() => signIn(provider)}
        >
          {pending === provider ?
            'Connecting…'
          : `Continue with ${provider === 'discord' ? 'Discord' : 'GitHub'}`}
        </Button>
      ))}
    </div>
  );
}
