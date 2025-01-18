import { pterodactylGetFullServerData } from '@/features/host/pterodactyl/queries/server-full-data.get';
import hostUserListSubscriptions from '@/features/host/queries/subscription/subscriptions.user';
import { HostSubscription } from '@/lib/db/schema';

import 'server-only';

export async function userGetPterodactylServers() {
  const subscriptions = await hostUserListSubscriptions();

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
    async (data) => {
      return pterodactylGetFullServerData(data);
    },
  );

  const serverData = await Promise.all(serverDataPromises);
  return serverData;
}
