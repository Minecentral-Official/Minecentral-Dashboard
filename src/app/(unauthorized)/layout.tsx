import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import getSession from '@/lib/auth/helpers/get-session';

export default async function UnauthorizeGuard({
  children,
}: PropsWithChildren) {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
