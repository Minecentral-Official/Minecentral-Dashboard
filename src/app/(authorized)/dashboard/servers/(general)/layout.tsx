import { PropsWithChildren } from 'react';

import { Metadata } from 'next';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export const metadata: Metadata = {
  title: 'Realms',
};

export default async function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
