import { MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HostSubscription } from '@/lib/db/schema';

export function HostStripeSubscriptionActions({
  hostSubscription,
}: {
  hostSubscription: HostSubscription;
}) {
  return (
    <>
      {/* Dialog for managing subscriptions (cancel and more) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            // disabled={!subscription.user}
            asChild
            className='hover:cursor-pointer'
          >
            {/* <Link
          to="/user/$userID"
          params={{ userID: (subscription.user?.id ?? "").toString() }}
        >
          View Profile
        </Link> */}
          </DropdownMenuItem>
          <DropdownMenuItem asChild className='hover:cursor-pointer'>
            <Link
              href={`https://panel.ronanhost.com/server/${hostSubscription.pterodactylServerUuid}`}
            >
              Manage Server
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            // onClick={() => setOpen((prev) => !prev)}
            className='hover:cursor-pointer'
            asChild
          >
            <Link
              href='/profile/billing/manage'
              // search={{ purchaseId: purchase.id }}
            >
              Manage Subscription
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <CopyToClipboard
            clipboardText={`${hostSubscription.pterodactylServerId || 0}`}
            asChild
          >
            <DropdownMenuItem>Copy Server ID</DropdownMenuItem>
          </CopyToClipboard>

          <CopyToClipboard
            clipboardText={`${hostSubscription.stripeSubscriptionId || 0}`}
            asChild
          >
            <DropdownMenuItem>Copy Subscription ID</DropdownMenuItem>
          </CopyToClipboard>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
