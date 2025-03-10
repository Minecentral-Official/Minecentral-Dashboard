import QuickLinks from '@/components/account/quick-links';
import UserProfile from '@/components/account/user-avatar';
import RecentActivity from '@/lib/activity/components/recent-activity';

export default function Page() {
  return (
    <div className='mx-auto w-full'>
      <h1 className='pb-4 text-3xl font-bold'>My Account</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <UserProfile />
          <RecentActivity />
        </div>
        <QuickLinks />
      </div>
    </div>
  );
}
