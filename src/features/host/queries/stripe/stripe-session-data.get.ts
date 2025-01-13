import { stripeAPI } from '@/lib/stripe/api/stripe.api';

export async function hostStripeGetSessionData(sessionId: string) {
  const session = await stripeAPI.checkout.sessions.retrieve(sessionId);

  return {
    status: session.status,
    payment_status: session.payment_status,
    payment_total: session.amount_total,
    subscription_id: session.subscription as string,
    customer_id: session.customer as string,
  };
}
