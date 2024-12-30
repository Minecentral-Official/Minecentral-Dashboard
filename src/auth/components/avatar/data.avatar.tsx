import getSession from '@/auth/lib/get-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function DataAvatar() {
  const session = await getSession();

  if (!session) {
    throw new Error('no session found');
  }

  return (
    <Avatar className='cursor-pointer'>
      <AvatarImage src={session.user.image ?? undefined} />
      <AvatarFallback>
        {session.user.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
