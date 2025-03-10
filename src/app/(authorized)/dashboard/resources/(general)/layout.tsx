import { PropsWithChildren } from 'react';

import { Metadata } from 'next';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export const metadata: Metadata = {
  title: 'Resources',
};

export default async function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
