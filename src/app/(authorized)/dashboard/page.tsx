import SignOutButton from '@/auth/components/buttons/sign-out.button';
import validateSession from '@/auth/lib/validate-session';

export default async function DashboardHomePage() {
  const { user } = await validateSession();
  return (
    <div>
      Hi: {user.name}, This is the dashboard homepage, only authorized users can
      visit this page
      <SignOutButton />
    </div>
  );
}
