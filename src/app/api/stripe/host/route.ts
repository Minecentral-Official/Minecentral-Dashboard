import Stripe from 'stripe';

import hostGetSubscriptionByStripeSubscriptionId from '@/features/host/queries/subscription/subscription-by-stripe-sub-id.get';
import { hostWebhookPaymentSuccess } from '@/features/host/webhook/payment.success';
import { serverEnv } from '@/lib/env/server.env';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import stripeGetSubscriptionById from '@/lib/stripe/queries/purchases/subscription-by-id.get';

import type { THostPayment } from '@/features/host/schemas/host-payment.type';

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
      console.error(err);
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
): Promise<THostPayment> {
  if (typeof stripeSubscriptionId !== 'string')
    throw new Error('Subscription is not a string!');
  const stripeSubscription =
    await stripeGetSubscriptionById(stripeSubscriptionId);

  //Grab HOST subscription via STRIPE subscription id
  const hostSubscription = await hostGetSubscriptionByStripeSubscriptionId(
    stripeSubscription.id,
  );

  return { hostSubscription, stripeSubscription };
}
