'use client';

import { useRef, useState } from 'react';

import { toast } from 'sonner';

import { authClient } from '@/lib/auth/configs/auth.client';

export default function useSignOut() {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  async function handleSignOut() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error('Sign-out failed');
      // Reload after revocation so private client/router state is discarded.
      window.location.replace('/sign-in');
    } catch {
      toast.error('Could not sign out. Please try again.');
      inFlight.current = false;
      setPending(false);
    }
  }
  return { handleSignOut, pending };
}
