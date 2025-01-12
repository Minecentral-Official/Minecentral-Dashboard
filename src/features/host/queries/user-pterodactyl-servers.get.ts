import { pterodactylClientGetServerStatus } from '@/features/host/lib/pterodactyl/client/server-status.get';
import { pterodactylGetAllocationById } from '@/features/host/lib/pterodactyl/queries/allocation-by-id.get';
import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import hostGetUserSubscriptions from '@/features/host/queries/subscriptions-by-user.get';
import { getStripeProductByPurchaseSubId } from '@/lib/stripe/queries/listings/product-listing-by-purchase-sub-id.get';
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
    async ({
      pterodactylServerId,
      stripeSubscriptionId,
      pterodactylServerUuid,
    }) => {
      //Pterodactyl data
      const pterodactylRequest = pterodactylGetServerById(pterodactylServerId);
      const pterodactylStatusRequest = await pterodactylClientGetServerStatus(
        pterodactylServerUuid,
      );
      //Stripe Data
      const stripeRequest =
        getStripeProductByPurchaseSubId(stripeSubscriptionId);

      //Wait for data
      const [
        pterodactylServerData,
        { metadata, ...stripeProductData },
        pterodactylServerStatus,
      ] = await Promise.all([
        pterodactylRequest,
        stripeRequest,
        pterodactylStatusRequest,
      ]);

      const allocationData = await pterodactylGetAllocationById(
        pterodactylServerData.node,
        pterodactylServerData.allocation,
      );

      //Validate Stripe metadata
      const validatedMetadata = metadataHostSchema.parse(metadata);

      const validatedStripeProductData = {
        metadata: validatedMetadata,
        ...stripeProductData,
      };

      return {
        pterodactylServerData: {
          ...pterodactylServerData,
          allocationData: { ...allocationData },
          status: pterodactylServerStatus,
        },
        stripeProductData: validatedStripeProductData,
      };
    },
  );

  const serverData = await Promise.all(serverDataPromises);
  return serverData;
}
