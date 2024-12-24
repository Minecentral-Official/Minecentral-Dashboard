import { config } from 'dotenv';
// import { PanelServer, PanelUser } from 'pterodactyl.ts';
import Stripe from 'stripe';

import findUserBySubscriptionID from '@/features/host-subscription/queries/find-user-subscription';
//TODO: Hugo, I need to import these, whats going on?

// TO_ALAIN: I created an eslint rule to prevent imports from different features
// This is to ensure code and folder structure quality. If you run into a lot of these problems try one of the two things:
// 1. You maybe aren't thinking in the 'features' folder structure way. These functions are meant to exist to support a single feature, and are only combined in our app folder
// Maybe you are doing too much in a single function
// 2. Rethink our folder structure, and decide whether stripe is actually a 'feature'
// I've been actually thinking about this, I think the stripe api should be a feature, but really stripe is kind of a meta feature, where it wraps around other features such as our server hosting feature here
// This means we will run into problems in the future, like we are now.
import getSubscriptionById from '@/features/stripe/queries/general/get-subscription-by-id.query';

config();

//Create a server if it doesnt exist (NOT FINISHED)
export async function webhookInvoicePaid(
  event: Stripe.InvoicePaymentSucceededEvent,
) {
  try {
    const subscription = await getSubscriptionById(
      // No type casting -.-
      // If you need to do 'as ___' it means that you probably need to do a check
      // if (typeof event.data.object.subscription === 'string') {
      //      return null
      //      === or do something more appropriate here ===
      // }
      event.data.object.subscription as string,
    );

    //Find or Create a user
    const user = await findUserBySubscriptionID({ sub_id: subscription.id });
    if (!user)
      throw new Error(
        `Could not find nor create a user from subscription ${user}`,
      );
    else console.log('Found user:', user);

    //Check if the user JUST bought this product
    if (!(await hasActivePurchase(subscription))) {
      // createPurchase(user, subscription, res);
    } else {
      console.log(
        'User has an active service on this subscription! Thanks for your payment!',
      );
      // res.send({
      //   status: 'already_active',
      //   message: 'Thanks for your payment',
      // });
    }
  } catch {
    // res.status(500).send('Something went wrong!');
  } finally {
    console.log(
      'Users payment has been registered to their subscription/product!',
    );
  }
}

async function hasActivePurchase(subscription: Stripe.Subscription) {
  const sub = await getSubscriptionById(subscription.id);
  return sub != null;
}

// async function createPurchase(
//   user: UserTableSelect,
//   subscription: Stripe.Subscription,
//   res: Response,
// ) {
//   try {
//     //Find or Create users PteroUser from Pterodactyl Backend
//     const pteroUser = await getPteroUser(user);
//     // Loop through subscription items and create a server for each
//     const servers = await createServersFromSubscription(
//       user,
//       subscription,
//       pteroUser,
//     );
//     console.log(
//       'Product Registered!',
//       // subscription.items.data,
//       'Created',
//       servers.length,
//       'servers!',
//     );
//   } catch (err) {
//     console.log('Unable to complete purchase:', err);
//     return res.status(500).send({
//       error: true,
//       message: 'Something super bad happened! Contact an Admin!',
//     });
//   }
//   res.status(200).send({ error: false, message: 'Services active!' });
// }

// async function createServersFromSubscription(
//   user: UserTableSelect,
//   subscription: Stripe.Subscription,
//   pteroUser: PanelUser,
// ): Promise<PanelServer[]> {
//   const servers: PanelServer[] = [];
//   for (const item of subscription.items.data) {
//     for (let i = 0; i < (item.quantity || 1); i++) {
//       const productString = item.plan.product as string;
//       const product = await stripeAPI.products.retrieve(productString);
//       // console.log("Product from sub", product);
//       //Convert Stripe.Metadata to type safe ProductMetadata
//       const meta: ProductMetadata = parseProductMetadata(product.metadata);
//       // console.log("Meta from Product", { ...plan });

//       const server: PanelServer | null = await createPteroServer(
//         pteroUser,
//         meta,
//       );
//       if (server) servers.push(server);
//       saveServerAsProduct(user, server, subscription, item, meta);
//     }
//   }
//   return servers;
// }

// async function saveServerAsProduct(
//   user: UserTableSelect,
//   server: PanelServer | null,
//   subscription: Stripe.Subscription,
//   item: Stripe.SubscriptionItem,
//   meta: ProductMetadata,
// ) {
//   await db.transaction(async (tx) => {
//     try {
//       const limits = await tx
//         .insert(productLimitsTable)
//         .values({ ...meta })
//         .returning();

//       // console.log("Subscription", subscription);
//       //await stripeAPI.invoices.retrieve(subscription.latest_invoice)

//       await tx.insert(productTable).values({
//         // serverId: newServer.id,
//         limitsId: limits[0].id,
//         customerId: user.stripeCustomerId || 'INVALID',
//         userId: user.id,
//         pteroServerId: server?.id || -1,
//         pteroServerIdentifier: server?.identifier || 'INVALID',
//         amount: item.plan.amount || 0,
//         expriesAt: subscription.current_period_end || 0,
//         subscriptionId: subscription.id,
//       });
//     } catch (error) {
//       // Rollback transaction in case of error
//       await tx.rollback();
//       console.error('Transaction failed, rolled back changes...');
//       throw error; // Propagate error after rollback
//     }
//   });
// }
