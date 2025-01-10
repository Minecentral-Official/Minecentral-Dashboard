import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import hostGetUserSubscriptions from '@/features/host/queries/subscriptions-by-user.get';
import { getStripeProductBySubId } from '@/lib/stripe/queries/product-by-sub-id.get';

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

  const subscriptionsWithValidServerId = subscriptions.filter(
    (
      subscription,
    ): subscription is TSubscription & { pterodactylServerId: number } =>
      !!subscription.pterodactylServerId,
  );

  const serverDataPromises = subscriptionsWithValidServerId.map(
    async ({ pterodactylServerId, stripeSubscriptionId }) => {
      const pterodactylRequest = pterodactylGetServerById(pterodactylServerId);
      const stripeRequest = getStripeProductBySubId(stripeSubscriptionId);

      const [pterodactylServerData, StripeProductData] = await Promise.all([
        pterodactylRequest,
        stripeRequest,
      ]);

      return {
        pterodactylServerData,
        StripeProductData,
      };
    },
  );

  const serverData = await Promise.all(serverDataPromises);
  return serverData;
}
