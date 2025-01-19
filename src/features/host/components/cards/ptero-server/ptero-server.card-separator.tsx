import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import { Separator } from '@/components/ui/separator';
import { pterodactylGetAllocationByNodeIdAndAllocationId } from '@/features/host/pterodactyl/queries/allocation-by-node-id-and-allocation-id.get';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';
import hostGetSubscriptionByPterodactylId from '@/features/host/queries/subscription/subscription-by-ptero-id.get';
import { stripeGetProductWithPricesBySubscriptionId } from '@/lib/stripe/queries/listings/product-with-price-by-sub-id.get';

type PteroServerCardDividerProps = {
  serverId: number;
};

export default async function PteroServerCardDivider({
  serverId,
}: PteroServerCardDividerProps) {
  // get allocation data
  const { node: nodeId, allocation: allocationId } =
    await pterodactylGetServerById(serverId);
  const allocation = await pterodactylGetAllocationByNodeIdAndAllocationId(
    nodeId,
    allocationId,
  );

  // get stripe plan data

  const subscriptionTableData =
    await hostGetSubscriptionByPterodactylId(serverId);

  const subscriptionListingData =
    await stripeGetProductWithPricesBySubscriptionId(
      subscriptionTableData?.stripeSubscriptionId ?? '',
    );

  return (
    <div className='mb-6 flex items-center gap-2'>
      <Separator className='w-4' />
      <span className='text-xs text-muted-foreground'>
        {subscriptionListingData.name}
      </span>

      <Separator className='flex-1' />
      <CopyToClipboard
        clipboardText={allocation?.ip + ':' + allocation?.port}
        asChild
      >
        <span className='cursor-pointer select-none rounded p-1 px-2 text-xs text-muted-foreground transition hover:bg-primary hover:text-primary-foreground'>
          {allocation?.ip}:{allocation?.port}
        </span>
      </CopyToClipboard>
      <Separator className='w-4' />
    </div>
  );
}
