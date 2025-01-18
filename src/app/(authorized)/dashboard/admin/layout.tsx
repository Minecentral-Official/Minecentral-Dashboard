import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import validateRole from '@/lib/auth/helpers/validate-role';

export default async function AdminGuard({ children }: PropsWithChildren) {
  if (!validateRole('admin')) {
    return redirect('/dashboard');
  }
  return <>{children}</>;
}
