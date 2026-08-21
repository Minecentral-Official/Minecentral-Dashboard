import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { DashboardListLoading } from '@/components/layouts/dashboard-loading';

export default function Loading() {
  return (
    <DashboardLayout>
      <DashboardListLoading rows={2} />
    </DashboardLayout>
  );
}
