import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';
import hostSubscriptionsByUserId from '@/features/host/queries/subscription/subscriptions-by-user-id.get';
import { HostSubscription } from '@/lib/db/schema';

import 'server-only';

export async function pterodactylGetServersByUserId(userId: string) {
  const subscriptions = await hostSubscriptionsByUserId(userId);

  //Grab a list of host subscriptions that have servers attached
  const subscriptionsWithValidServerId = subscriptions.filter(
    (
      subscription,
    ): subscription is HostSubscription & {
      pterodactylServerId: number;
      pterodactylServerUuid: string;
    } => !!subscription.pterodactylServerId,
  );

  const serverDataPromises = subscriptionsWithValidServerId.map(
    ({ pterodactylServerId }) => pterodactylGetServerById(pterodactylServerId),
  );

  const serverData = await Promise.all(serverDataPromises);
  return serverData;
}
