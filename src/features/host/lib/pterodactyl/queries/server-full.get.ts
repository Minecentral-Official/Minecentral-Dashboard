import { pterodactylGetAllocationById } from '@/features/host/lib/pterodactyl/queries/allocation-by-id.get';
import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import hostGetSubscriptionByServerId from '@/features/host/queries/subscription-by-server-id.get';
import { getStripeProductByPurchaseSubId } from '@/lib/stripe/queries/listings/product-listing-by-purchase-sub-id.get';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

export async function pterodactylGetFullServerData({
  pterodactylServerId,
  // stripeSubscriptionId,
  // pterodactylServerUuid,
}: {
  pterodactylServerId: number;
  // stripeSubscriptionId: string;
  // pterodactylServerUuid: string;
}) {
  //Pterodactyl data
  const pterodactylRequest = pterodactylGetServerById(pterodactylServerId);
  const hostSubscriptionRequest =
    hostGetSubscriptionByServerId(pterodactylServerId);
  // const pterodactylStatusRequest = pterodactylClientGetServerStatus(
  //   pterodactylServerUuid,
  // );
  //Stripe Data
  // const stripeRequest = getStripeProductByPurchaseSubId(stripeSubscriptionId);

  //Wait for data
  const [pterodactylServer, hostSubscription] = await Promise.all([
    pterodactylRequest,
    hostSubscriptionRequest,
  ]);

  if (!hostSubscription)
    throw new Error('Unable to grab host data from server id');
  const { metadata: stripeProductMetadata, ...stripeProductData } =
    await getStripeProductByPurchaseSubId(
      hostSubscription.stripeSubscriptionId,
    );

  const allocationData = await pterodactylGetAllocationById(
    pterodactylServer.node,
    pterodactylServer.allocation,
  );

  if (!allocationData)
    throw new Error('Unable to grab allocation data from server id');

  //Validate Stripe metadata
  const validatedMetadata = metadataHostSchema.parse(stripeProductMetadata);

  const validatedStripeProductData = {
    metadata: validatedMetadata,
    ...stripeProductData,
  };

  return {
    // pterodactylServerData: {
    server: pterodactylServer,
    allocation: allocationData,
    subscription: {
      host: hostSubscription,
      stripe: validatedStripeProductData,
    },
    // status: pterodactylServerStatus,
    // },
    // stripeProductData: validatedStripeProductData,
  };
}
