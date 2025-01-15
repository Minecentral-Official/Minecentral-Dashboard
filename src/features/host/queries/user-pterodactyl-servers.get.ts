import { pterodactylGetFullServerData } from '@/features/host/lib/pterodactyl/queries/server-full.get';
import hostGetUserSubscriptions from '@/features/host/queries/subscriptions-by-user.get';

import 'server-only';

type TSubscription = {
  id: number;
  pterodactylServerId: number | null;
  pterodactylServerUuid: string | null;
  stripeSubscriptionId: string;
  hostCustomerId: number;
};

export async function hostGetUserPterdactylServers() {
  const subscriptions = await hostGetUserSubscriptions();

  //Grab a list of subscriptions that have servers attached
  const subscriptionsWithValidServerId = subscriptions.filter(
    (
      subscription,
    ): subscription is TSubscription & {
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
