import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function DataAvatar() {
  const session = await validateSession();

  return (
    <WrapperAvatar
      image={session.user.image ?? undefined}
      name={session.user.name}
    />
  );
}
