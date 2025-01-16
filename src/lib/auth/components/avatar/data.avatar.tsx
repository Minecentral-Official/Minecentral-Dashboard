import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';
import getSession from '@/lib/auth/helpers/get-session';

export default async function DataAvatar() {
  const session = await getSession();

  if (!session) {
    throw new Error('no session found');
  }

  return (
    <WrapperAvatar
      image={session.user.image ?? undefined}
      name={session.user.name}
    />
  );
}
