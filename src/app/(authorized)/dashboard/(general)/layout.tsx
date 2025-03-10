import { PropsWithChildren } from 'react';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default async function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
