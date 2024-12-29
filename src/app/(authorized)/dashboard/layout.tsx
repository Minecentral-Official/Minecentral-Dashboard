import { PropsWithChildren } from 'react';

import DashboardSidebar from '@/components/sidebar/sidebar.wrapper';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardSidebar>{children}</DashboardSidebar>;
}
