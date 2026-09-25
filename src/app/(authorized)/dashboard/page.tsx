import Link from 'next/link';

import AccountOverview from '@/components/account/overview';
import AccountQuickaccess from '@/components/account/quickaccess';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/env/feature-flags';

export default async function Page() {
  return (
    <DashboardLayout>
      <div className='space-y-4'>
        {featureFlags.workspaces && (
          <div className='flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-5'>
            <div>
              <h1 className='text-xl font-semibold'>Your server workspaces</h1>
              <p className='mt-1 text-sm text-muted-foreground'>
                Plan runtimes, keep notes and work with your team.
              </p>
            </div>
            <Button asChild>
              <Link href='/servers'>Open My Servers</Link>
            </Button>
          </div>
        )}
        <AccountOverview />
        <AccountQuickaccess />
      </div>
    </DashboardLayout>
  );
}
