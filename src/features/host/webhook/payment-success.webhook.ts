// import { PanelServer, PanelUser } from 'pterodactyl.ts';
import Stripe from 'stripe';

import { pterodactylServerCreate } from '@/features/host/lib/pterodactyl/server/server.create';
import { pterodactylUserFindById } from '@/features/host/lib/pterodactyl/user/user-by-id.find';
import { hostCreateSubscription } from '@/features/host/mutations/subscription.create';
import hostGetCustomerByStripeCustomerId from '@/features/host/queries/customer-by-stripe-customer-id.get';
import hostGetSubscriptionByStripeId from '@/features/host/queries/subscription-by-id.get';
import { HostCustomer } from '@/lib/db/schema';
import getStripeSubscriptionById from '@/lib/stripe/queries/get-subscription-by-id.query';
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
      newServerPurchase(stripeSubscription);
    } else {
      //Person is making a recurring payment or an overdue payment!
      //UnSuspend ptero server
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

async function newServerPurchase(stripeSubscription: Stripe.Subscription) {
  const customerString = stripeSubscription.customer;
  const isCustomerString = typeof customerString === 'string';
  if (!isCustomerString) throw new Error('Customer is not a string!');
  const hostCustomer = await hostGetCustomerByStripeCustomerId(customerString);
  if (!hostCustomer) {
    //Client has no prior custome data, CREATE IT!
    console.log('customer:', hostCustomer);
  } else {
    //Add Subscription to HostSubscription table
    const hostSubscription = await hostCreateSubscription({
      hostCustomerId: hostCustomer.id,
      stripeSubscriptionId: stripeSubscription.id,
    });
    if (!hostSubscription) throw new Error("Host Subscription doesn't exist!");
    //Create a Pterodactyl server
    createServer(
      hostSubscription,
      metadataHostSchema.parse(stripeSubscription.metadata),
    );
    //Update Subscription table data with Ptero data if it exists
  }
}
