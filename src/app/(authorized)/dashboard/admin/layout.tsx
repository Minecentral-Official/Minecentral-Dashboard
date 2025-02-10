import { PropsWithChildren } from 'react';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import validateRole from '@/lib/auth/helpers/validate-role';

export const metadata: Metadata = {
  title: 'Admin',
};

export default async function AdminGuard({ children }: PropsWithChildren) {
  if (!(await validateRole('admin'))) {
    return redirect('/dashboard');
  }
  return <>{children}</>;
}
