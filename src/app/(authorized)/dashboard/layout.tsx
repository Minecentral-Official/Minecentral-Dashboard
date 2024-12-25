import { PropsWithChildren } from 'react';

import DashboardSidebar from '@/components/services/dashboard/sidebar/dashboard.sidebar';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardSidebar>{children}</DashboardSidebar>;
}
