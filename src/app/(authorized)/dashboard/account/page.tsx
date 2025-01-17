import AccountOverview from '@/components/account/overview';
import AccountQuickaccess from '@/components/account/quickaccess';

export default async function Page() {
  return (
    <div className='space-y-4'>
      <AccountOverview />
      <AccountQuickaccess />
    </div>
  );
}
