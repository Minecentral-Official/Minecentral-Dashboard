import { pterodactylGetAllocationById } from '@/features/host/lib/pterodactyl/queries/allocation-by-id.get';
import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';

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
  const pterodactylServer = await pterodactylGetServerById(pterodactylServerId);
  // const pterodactylStatusRequest = pterodactylClientGetServerStatus(
  //   pterodactylServerUuid,
  // );
  //Stripe Data
  // const stripeRequest = getStripeProductByPurchaseSubId(stripeSubscriptionId);

  //Wait for data
  // const [
  //   pterodactylServerData,
  //   // { metadata, ...stripeProductData },
  //   // pterodactylServerStatus,
  // ] = await Promise.all([
  //   pterodactylRequest,
  //   // stripeRequest,
  //   // pterodactylStatusRequest,
  // ]);

  const allocationData = await pterodactylGetAllocationById(
    pterodactylServer.node,
    pterodactylServer.allocation,
  );

  //Validate Stripe metadata
  // const validatedMetadata = metadataHostSchema.parse(metadata);

  // const validatedStripeProductData = {
  //   metadata: validatedMetadata,
  //   // ...stripeProductData,
  // };

  return {
    // pterodactylServerData: {
    ...pterodactylServer,
    allocationData: { ...allocationData },
    // status: pterodactylServerStatus,
    // },
    // stripeProductData: validatedStripeProductData,
  };
}
