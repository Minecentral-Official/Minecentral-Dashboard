import { headers } from 'next/headers';

import { auth } from '@/lib/auth/configs/auth.server';

export default async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
