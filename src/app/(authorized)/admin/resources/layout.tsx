import requirePermission from '@/lib/auth/helpers/require-permission';

import type { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  await requirePermission('resources:moderate');
  return children;
}
