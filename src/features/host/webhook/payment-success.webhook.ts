// import { PanelServer, PanelUser } from 'pterodactyl.ts';
import Stripe from 'stripe';

import { pterodactylServerCreate } from '@/features/host/lib/pterodactyl/server/server.create';
import { pterodactylUserFindById } from '@/features/host/lib/pterodactyl/user/user-by-id.find';
import hostCreateSubscription from '@/features/host/mutations/subscription.create';
import hostGetCustomerByStripeCustomerId from '@/features/host/queries/customer-by-stripe-customer-id.get';
import hostGetSubscriptionById from '@/features/host/queries/subscription-by-id.get';
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
    const subscriptionString = event.data.object.subscription;
    const isSubscriptionString = typeof subscriptionString === 'string';
    if (!isSubscriptionString) throw new Error('Subscription is not a string!');
    const stripeSubscription =
      await getStripeSubscriptionById(subscriptionString);
    const hostSubscription = await hostGetSubscriptionById(
      stripeSubscription.id,
    );

    if (!hostSubscription) {
      //First time the person has made a payment for this subscription!
      const customerString = stripeSubscription.customer;
      const isCustomerString = typeof customerString === 'string';
      if (!isCustomerString) throw new Error('Customer is not a string!');
      const hostCustomer =
        await hostGetCustomerByStripeCustomerId(customerString);
      if (!hostCustomer) {
        //Client has no prior custome data, CREATE IT!
        console.log('customer:', hostCustomer);
      } else {
        //Add Subscription to table (no ptero data for error safety)
        const hostSubscription = await createSubscription(
          hostCustomer.id,
          stripeSubscription.id,
        );
        if (!hostSubscription)
          throw new Error("Host Subscription doesn't exist!");
        //Create a Pterodactyl server
        createServer(
          hostSubscription,
          metadataHostSchema.parse(stripeSubscription.metadata),
        );
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

async function createSubscription(
  hostCustomerId: number,
  stripeSubscriptionId: string,
) {
  return hostCreateSubscription({ hostCustomerId, stripeSubscriptionId });
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
