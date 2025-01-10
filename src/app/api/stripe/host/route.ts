import Stripe from 'stripe';

import { HostPaymentType } from '@/features/host/lib/enum/host-payment.enum';
import hostGetSubscriptionByStripeId from '@/features/host/queries/subscription-by-id.get';
import { hostWebhookPaymentSuccess } from '@/features/host/webhook/payment-success.webhook';
import { serverEnv } from '@/lib/env/server.env';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import getStripeSubscriptionById from '@/lib/stripe/queries/get-subscription-by-id.query';

export async function POST(req: Request) {
  try {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    let event;
    try {
      if (!sig) throw new Error();
      event = stripeAPI.webhooks.constructEvent(
        body,
        sig,
        serverEnv.STRIPE_WEBHOOK_SECRET_KEY,
      );
    } catch (err) {
      console.log(err);
      return new Response(`Webhook Error`, { status: 400 });
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const subData = await getSubscription(event.data.object.subscription);
        //Fires when a subscription is created and paid each month
        hostWebhookPaymentSuccess(subData);
        break;
      case 'invoice.payment_failed':
        // webhookPaymentFailed(event, res);
        // return updatedAccount(req, res);
        break;
      case 'customer.subscription.deleted':
        //   webhookSubscriptionEnd(event.data.object, res);
        break;
      default:
        return new Response('Not Listening to this Event, thank you!', {
          status: 200,
        });
    }
    return new Response('Woah, you made it!', {
      status: 200,
    });
  } catch {
    return new Response(`Webhook Error`, { status: 400 });
  }
}

//This will return a users STRIPE subscription and their HOST subscription data
async function getSubscription(
  stripeSubscriptionId: string | Stripe.Subscription | null,
): Promise<HostPaymentType> {
  if (typeof stripeSubscriptionId !== 'string')
    throw new Error('Subscription is not a string!');
  const stripeSubscription =
    await getStripeSubscriptionById(stripeSubscriptionId);

  //Grab HOST subscription via STRIPE subscription id
  const hostSubscription = await hostGetSubscriptionByStripeId(
    stripeSubscription.id,
  );
  //TYPE CASTING: Safe as this is stripe stuff, believe me!
  const stripeCustomer = stripeSubscription.customer as Stripe.Customer;
  return { stripeSubscription, stripeCustomer, hostSubscription };
}
