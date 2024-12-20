import { useRouter } from 'next/navigation';

import { authClient } from '@/auth/lib/auth-client';

export default function useSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  }
  return { handleSignOut };
}
