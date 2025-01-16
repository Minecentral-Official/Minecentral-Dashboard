import { DTOProductHost } from '@/features/host/dto/host-product.dto';
import { pterodactylGetAllocationById } from '@/features/host/lib/pterodactyl/queries/allocation-by-id.get';
import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import hostGetSubscriptionByServerId from '@/features/host/queries/subscription-by-server-id.get';
import { getStripeProductByPurchaseSubId } from '@/lib/stripe/queries/listings/product-listing-by-purchase-sub-id.get';

export async function pterodactylGetFullServerData({
  pterodactylServerId,
}: {
  pterodactylServerId: number;
}) {
  //Pterodactyl data
  const pterodactylRequest = pterodactylGetServerById(pterodactylServerId);
  const hostSubscriptionRequest =
    hostGetSubscriptionByServerId(pterodactylServerId);

  //Wait for data
  const [pterodactylServer, hostSubscription] = await Promise.all([
    pterodactylRequest,
    hostSubscriptionRequest,
  ]);

  if (!hostSubscription)
    throw new Error('Unable to grab host data from server id');

  //Get Stripe Product Data
  const stripeProductData = DTOProductHost(
    await getStripeProductByPurchaseSubId(
      hostSubscription.stripeSubscriptionId,
    ),
  );

  //Allocation Data from ptero server
  const allocationData = await pterodactylGetAllocationById(
    pterodactylServer.node,
    pterodactylServer.allocation,
  );

  if (!allocationData)
    throw new Error('Unable to grab allocation data from server id');

  return {
    // pterodactylServerData: {
    server: pterodactylServer,
    allocation: allocationData,
    subscription: {
      host: hostSubscription,
      stripe: stripeProductData,
    },
    // status: pterodactylServerStatus,
    // },
    // stripeProductData: validatedStripeProductData,
  };
}
