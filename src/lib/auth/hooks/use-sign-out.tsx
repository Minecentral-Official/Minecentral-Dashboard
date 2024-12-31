import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/auth/configs/auth.client';

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
