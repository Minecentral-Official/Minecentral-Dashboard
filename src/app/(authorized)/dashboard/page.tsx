import AccountOverview from '@/components/account/overview';
import AccountQuickaccess from '@/components/account/quickaccess';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default async function Page() {
  return (
    <DashboardLayout>
      <div className='space-y-4'>
        <AccountOverview />
        <AccountQuickaccess />
      </div>
    </DashboardLayout>
  );
}
