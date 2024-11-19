import { headers } from 'next/headers';

import 'server-only';

import { auth } from '@/auth/lib/auth';

export default async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
