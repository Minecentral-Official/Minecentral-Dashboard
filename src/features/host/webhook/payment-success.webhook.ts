// import { PanelServer, PanelUser } from 'pterodactyl.ts';
import { User } from 'better-auth';
import Stripe from 'stripe';

import { pterodactylServerCreate } from '@/features/host/lib/pterodactyl/server/server.create';
import { pterodactylUserFindById } from '@/features/host/lib/pterodactyl/user/user-by-id.find';
import { pterodactylCreateUser } from '@/features/host/lib/pterodactyl/user/user.create';
import { hostCreateCustomer } from '@/features/host/mutations/customer.create';
import { hostCreateSubscription } from '@/features/host/mutations/subscription.create';
import hostGetCustomerByStripeCustomerId from '@/features/host/queries/customer-by-stripe-customer-id.get';
import hostGetSubscriptionByStripeId from '@/features/host/queries/subscription-by-id.get';
import getUserByEmail from '@/lib/auth/queries/user-by-email.find';
import { HostCustomer } from '@/lib/db/schema';
import getStripeSubscriptionById from '@/lib/stripe/queries/get-subscription-by-id.query';
import stripeGetProductById from '@/lib/stripe/queries/product-by-id.get';
import {
  metadataHostSchema,
  MetadataHostType,
} from '@/lib/stripe/schemas/host-metadata.zod';

//Create a server if it doesnt exist (NOT FINISHED)
export async function hostPaymentSuccessWebhook(
  event: Stripe.InvoicePaymentSucceededEvent,
) {
  try {
    //Grab the sub id from event
    const stripeSubscriptionId = event.data.object.subscription;
    if (typeof stripeSubscriptionId !== 'string')
      throw new Error('Subscription is not a string!');
    const stripeSubscription =
      await getStripeSubscriptionById(stripeSubscriptionId);

    //Grab HOST subscription via STRIPE subscription id
    const hostSubscription = await hostGetSubscriptionByStripeId(
      stripeSubscription.id,
    );

    if (!hostSubscription) {
      //First time the person has made a payment for this subscription!
      //New purchase, give user access to their new pterodactyl server
      // const stripeCustomer = await getStripeCustomerBySubscriptionId(stripeSubscriptionId)
      const user = await getUserByEmail(
        (stripeSubscription.customer as Stripe.Customer).email || 'n/a',
      );
      if (!user)
        throw new Error(
          'Someone purchased a server without creating an account first!',
        );
      newPtero(stripeSubscription, user);
    } else {
      //Person is making a recurring payment or an overdue payment!
      //UnSuspend ptero server
      // continuePtero();
    }
  } catch (err) {
    console.log(err);
  } finally {
  }
}

async function createServer(
  hostCustomer: HostCustomer,
  plan: MetadataHostType,
) {
  return pterodactylServerCreate(
    await pterodactylUserFindById(hostCustomer.pterodactylUserId),
    plan,
  );
}

async function newPtero(stripeSubscription: Stripe.Subscription, user: User) {
  const stripeCustomer = stripeSubscription.customer as Stripe.Customer;
  // const isCustomerString = typeof customerString === 'string';
  // if (!isCustomerString) throw new Error('Customer is not a string!');
  let hostCustomer = await hostGetCustomerByStripeCustomerId(stripeCustomer.id);
  if (!hostCustomer) {
    //Client has no prior customer data, CREATE IT!
    const pteroUser = await pterodactylCreateUser(user);
    if (!pteroUser)
      throw new Error(
        'Could not create nor find a users pterodactyl panel user data!',
      );
    hostCustomer = await hostCreateCustomer({
      userId: user.id,
      pterodactylUserId: pteroUser.id,
      stripeCustomerId: (stripeSubscription.customer as Stripe.Customer).id,
    });
  }
  //Add Subscription to HostSubscription table
  const hostSubscription = await hostCreateSubscription({
    hostCustomerId: hostCustomer.id,
    stripeSubscriptionId: stripeSubscription.id,
  });
  if (!hostSubscription) throw new Error("Host Subscription doesn't exist!");
  //Create a Pterodactyl server
  const stripeMetadata = await stripeGetProductById(
    stripeSubscription.items.data[0].plan.product as string,
  );
  const pteroServer = await createServer(
    hostSubscription,
    metadataHostSchema.parse(stripeMetadata.metadata),
  );
}
