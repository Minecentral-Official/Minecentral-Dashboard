// I commented out this file because we don't have all the pieces to resolve eslint errors
// Specifically we need pterodactyl set up

// import { eq } from 'drizzle-orm';
// import Stripe from 'stripe';

// import { db } from '@/lib/db';
// import { hostSubscription } from '@/lib/db/schema';

// export async function webhookSubscriptionEnd(
//   subscription: Stripe.Subscription,
//   res: Response,
// ) {
//   try {
//     const terminatingSubscription = await db.query.hostSubscription.findFirst({
//       where: eq(hostSubscription.subscriptionId, subscription.id),
//       with: { user: true },
//     });
//     console.log(
//       'Suspending server due to inactive Subscription from the user',
//       terminatingSubscription?.user.name,
//     );

//     if (
//       terminatingSubscription !== undefined &&
//       terminatingSubscription.pteroServerId !== -1
//     ) {
//       //Suspend server
//       try {
//         (
//           await pteroServer.getServer(terminatingSubscription.pteroServerId)
//         ).suspend();
//       } catch (err) {
//         console.log(
//           'Could not suspend server',
//           terminatingSubscription.pteroServerId,
//           "on Pterodactyl's side",
//         );
//       } finally {
// // Careful here, the finally block runs no matter if there is an error or not
// // We probably don't want this to run if there has been an error. This should probably take place in the try block
//         console.log(
//           'Server',
//           terminatingSubscription.pteroServerId,
//           'has been suspended!',
//         );
//       }
//     } else {
//       console.log(
//         'There was no server to suspend, the server id was',
//         terminatingSubscription?.pteroServerId,
//       );
//     }

//     //Set Product to inactive on our side (incase people want to resub in the future)
//     await db
//       .update(productTable)
//       .set({ active: false })
//       .where(eq(productTable.subscriptionId, subscription.id));
//     console.log('Deactivated Product from product table!');
//     res.send({ status: 'ok', message: 'Deactivated users server!' });
//   } catch (err) {
//     throw err;
//   }
// }
