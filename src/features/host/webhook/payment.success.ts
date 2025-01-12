import { User } from 'better-auth';
import Stripe from 'stripe';

import { pterodactylServerCreate } from '@/features/host/lib/pterodactyl/mutations/server.create';
import { hostCreateCustomer } from '@/features/host/mutations/customer.create';
import { hostCreateSubscription } from '@/features/host/mutations/subscription.create';
import { hostUpdateSubscription } from '@/features/host/mutations/subscription.update';
import hostGetCustomerByStripeCustomerId from '@/features/host/queries/customer-by-stripe-customer-id.get';
import { THostPayment } from '@/features/host/schemas/host-payment.type';
import getUserByEmail from '@/lib/auth/queries/user-by-email.get';
import { HostSubscription } from '@/lib/db/schema';
import stripeGetProductById from '@/lib/stripe/queries/listings/product-listing-by-id.get';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

//Create a server if it doesnt exist or un-suspend server if created
export async function hostWebhookPaymentSuccess({
  hostSubscription,
  stripeCustomer,
  stripeSubscription,
}: THostPayment) {
  try {
    if (!hostSubscription) {
      //First time the person has made a payment for this subscription!
      //New purchase, give user access to their new pterodactyl server
      const user = await getUserByEmail(stripeCustomer.email || 'n/a');
      if (!user)
        throw new Error(
          'Someone purchased a server without creating an account first!',
        );
      hostSubscription = await createHostSubscription(
        stripeSubscription,
        stripeCustomer,
        user,
      );
      // newPtero(stripeCustomer, user);
    }
    if (!hostSubscription)
      throw new Error('Unable to create or find users host subscription!');
    if (hostSubscription.pterodactylServerId) {
      //Server exists, unsuspend incase of late payment
    } else {
      //Create pterodactyl server
      // console.log(
      //   'Product Info',
      //   stripeSubscription.items.data[0].plan.product,
      // );
      const stripeMetadata = await stripeGetProductById(
        (stripeSubscription.items.data[0].plan.product as Stripe.Product).id,
      );

      const pteroServer = await pterodactylServerCreate(
        hostSubscription.customer.user,
        // await pterodactylUserFindById(
        //   hostSubscription.customer.pterodactylUserId,
        // ),
        metadataHostSchema.parse(stripeMetadata.metadata),
      );

      if (!pteroServer)
        throw new Error('Unable to create a server for users product!');
      hostUpdateSubscription({
        pterodactylServerId: pteroServer?.id,
        pterodactylServerUuid: pteroServer?.uuid,
        hostId: hostSubscription.id,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function createHostSubscription(
  stripeSubscription: Stripe.Subscription,
  stripeCustomer: Stripe.Customer,
  user: User,
): Promise<HostSubscription | undefined> {
  //Get users current customer id, as they might have purchased with us before
  const hostCustomer = await findOrCreateHostCustomer(stripeCustomer, user);
  //hostCustomer is now a valid value, create a host subscription
  const hostSubscription = await hostCreateSubscription({
    hostCustomerId: hostCustomer.id,
    stripeSubscriptionId: stripeSubscription.id,
  });
  return hostSubscription;
}

//Finds or creates a Host Customer
async function findOrCreateHostCustomer(
  stripeCustomer: Stripe.Customer,
  user: User,
) {
  let hostCustomer = await hostGetCustomerByStripeCustomerId(stripeCustomer.id);
  if (!hostCustomer) {
    //Customer has no prior host data, CREATE IT!

    //Create Pterodactyl User (for panel login and server assigning)
    // const pteroUser = await pterodactylCreateUser(user);

    //Create a Host Customer
    hostCustomer = await hostCreateCustomer({
      userId: user.id,
      // pterodactylUserId: pteroUser.id,
      stripeCustomerId: stripeCustomer.id,
    });
  }
  return hostCustomer;
}

// async function newPtero(
//   stripeCustomer: Stripe.Customer,
//   hostCustomer: HostCustomer,
//   user: User,
// ) {
//   //Create a Pterodactyl server
//   const stripeMetadata = await stripeGetProductById(
//     stripeSubscription.items.data[0].plan.product as string,
//   );
//   const pteroServer = await createServer(
//     hostSubscription,
//     metadataHostSchema.parse(stripeMetadata.metadata),
//   );
//   console.log(pteroServer);
// }
