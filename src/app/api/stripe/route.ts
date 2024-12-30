import { serverEnv } from '@/lib/env/server.env';
import { stripeAPI } from '@/stripe/lib/stripe.api';

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
        //Fires when a subscription is created and paid each month
        //   webhookInvoicePaid(event, res);
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
