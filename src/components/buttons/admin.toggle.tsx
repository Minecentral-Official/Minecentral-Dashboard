import Link from 'next/link';

import { Button } from '@/components/ui/button';
import validateRole from '@/lib/auth/helpers/validate-role';

export default async function AdminToggleButton({
  isOnAdmin,
}: {
  isOnAdmin: boolean;
}) {
  const isAdmin = validateRole('admin');
  if (!isAdmin) return <></>;
  const text = isOnAdmin ? 'Back to Dashboard' : 'Admin';
  const link = isOnAdmin ? '/dashboard' : '/admin';
  return (
    <Button variant='ghost' asChild>
      <Link href={link}>{text}</Link>
    </Button>
  );
}
