import hostSubscriptionsByUserId from '@/features/host/queries/subscription/subscriptions-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function HostServerCount() {
  const { user } = await validateSession();
  const servers = await hostSubscriptionsByUserId(user.id);
  const serverCount = servers.length;
  return <>{serverCount}</>;
}
