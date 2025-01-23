import { PropsWithChildren } from 'react';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import getSession from '@/lib/auth/helpers/get-session';

export const metadata: Metadata = {
  title: {
    template: 'Minecentral | %s',
    default: 'Minecentral | Dashboard',
  },
};

export default async function AuthorizeGuard({ children }: PropsWithChildren) {
  const session = await getSession();
  if (!session) {
    redirect('/sign-in');
  }
  return <>{children}</>;
}
