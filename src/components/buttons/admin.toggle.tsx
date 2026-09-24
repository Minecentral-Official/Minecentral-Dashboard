import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function AdminToggleButton({
  isOnAdmin,
}: {
  isOnAdmin: boolean;
}) {
  const { user } = await validateSession();
  const isAdmin = hasPermission(user.role, 'admin:access');
  if (!isAdmin) return <></>;
  const text = isOnAdmin ? 'Back to Dashboard' : 'Admin';
  const link = isOnAdmin ? '/dashboard' : '/admin';
  return (
    <Button variant='ghost' className='w-full justify-start' asChild>
      <Link href={link}>{text}</Link>
    </Button>
  );
}
