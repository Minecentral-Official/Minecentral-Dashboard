import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import hostGetUserSubscriptions from '@/features/host/queries/subscriptions-by-user.get';
import { getStripeProductBySubId } from '@/lib/stripe/queries/product-by-sub-id.get';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

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

      const [pterodactylServerData, { metadata, ...stripeProductData }] =
        await Promise.all([pterodactylRequest, stripeRequest]);

      const validatedMetadata = metadataHostSchema.parse(metadata);

      const validatedStripeProductData = {
        metadata: validatedMetadata,
        ...stripeProductData,
      };

      return {
        pterodactylServerData,
        StripeProductData: validatedStripeProductData,
      };
    },
  );

  const serverData = await Promise.all(serverDataPromises);
  return serverData;
}
