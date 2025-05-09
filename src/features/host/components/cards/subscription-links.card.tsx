import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type HostStripeSubscriptionLinkProps = {
  panelLink: string;
};

export function HostStripeSubscriptionLinks({
  panelLink,
}: HostStripeSubscriptionLinkProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Links</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <Button variant='link' className='h-4 justify-start p-0' asChild>
          <Link href={panelLink}>Panel</Link>
        </Button>
        <Button variant='link' className='h-4 justify-start p-0' asChild>
          <Link href='/profile/billing/manage'>Payment</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// export function HostStripeSubscriptionActions({
//   panelLink,
//   serverId,

// }: {
//   hostSubscription: HostSubscription;
// }) {
//   return (
//     <>
//       {/* Dialog for managing subscriptions (cancel and more) */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant='ghost' className='h-8 w-8 p-0'>
//             <span className='sr-only'>Open menu</span>
//             <MoreHorizontalIcon className='h-4 w-4' />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align='end'>
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             // disabled={!subscription.user}
//             asChild
//             className='hover:cursor-pointer'
//           >
//             {/* <Link
//           to="/user/$userID"
//           params={{ userID: (subscription.user?.id ?? "").toString() }}
//         >
//           View Profile
//         </Link> */}
//           </DropdownMenuItem>
//           <DropdownMenuItem asChild className='hover:cursor-pointer'>
//             <Link
//               href={panelLink}
//             >
//               Manage Server
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             // onClick={() => setOpen((prev) => !prev)}
//             className='hover:cursor-pointer'
//             asChild
//           >
//             <Link
//               href='/profile/billing/manage'
//               // search={{ purchaseId: purchase.id }}
//             >
//               Manage Subscription
//             </Link>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />

//           <CopyToClipboard
//             clipboardText={`${hostSubscription.pterodactylServerId || 0}`}
//             asChild
//           >
//             <DropdownMenuItem>Copy Server ID</DropdownMenuItem>
//           </CopyToClipboard>

//           <CopyToClipboard
//             clipboardText={`${hostSubscription.stripeSubscriptionId || 0}`}
//             asChild
//           >
//             <DropdownMenuItem>Copy Subscription ID</DropdownMenuItem>
//           </CopyToClipboard>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </>
//   );
// }
