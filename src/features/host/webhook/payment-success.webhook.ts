// import { PanelServer, PanelUser } from 'pterodactyl.ts';
import Stripe from 'stripe';

import createHostSubscription from '@/features/host/mutations/subscription.create';
import getSubscriptionById from '@/features/host/queries/subscription-by-id.get';
import getStripeSubscriptionById from '@/lib/stripe/queries/get-subscription-by-id.query';
import getUserByCustomerId from '@/lib/stripe/queries/user-by-customer-id.get';

//Create a server if it doesnt exist (NOT FINISHED)
export async function hostPaymentSuccessWebhook(
  event: Stripe.InvoicePaymentSucceededEvent,
) {
  try {
    //Grab the sub id from event
    const subscriptionString = event.data.object.subscription;
    const isSubscriptionString = typeof subscriptionString === 'string';
    if (!isSubscriptionString) throw new Error('Subscription is not a string!');
    const stripeSubscription =
      await getStripeSubscriptionById(subscriptionString);
    const hostSubscription = await getSubscriptionById(stripeSubscription.id);

    if (!hostSubscription) {
      //First time the person has made a payment for this subscription!
      const customerString = stripeSubscription.customer;
      const isCustomerString = typeof customerString === 'string';
      if (!isCustomerString) throw new Error('Customer is not a string!');
      const customer = await getUserByCustomerId(customerString, 'host');
      if (!customer) {
        console.log('customer:', customer);
      } else {
        //Add Subscription to table (no ptero data for error safety)
        createHostSubscription({
          userId: customer.userId,
          subscriptionId: stripeSubscription.id,
        });
        //Create a Pterodactyl server
        //Update Subscription table data with Ptero data if it exists
      }
    } else {
      //Person is making a recurring payment or an overdue payment!
      //UnSuspend ptero server
    }
  } catch (err) {
    console.log(err);
  } finally {
  }
}

// async function hasActivePurchase(subscription: Stripe.Subscription) {
//   const sub = await getSubscriptionById(subscription.id);
//   return sub != null;
// }

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
