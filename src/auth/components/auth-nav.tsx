import Link from 'next/link';

import getSession from '@/auth/lib/get-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default async function AuthNav() {
  const session = await getSession();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>Sign In</Link>
      </Button>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={session.user.image ?? undefined} />
      <AvatarFallback>
        {session.user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
