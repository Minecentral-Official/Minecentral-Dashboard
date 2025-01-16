import { User } from 'better-auth';

import hostGetCustomerByUserId from '@/features/host/queries/customer-by-user-id.get';
import { serverEnv } from '@/lib/env/server.env';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

export async function hostStripeCreateSession(user: User, priceId: string) {
  let customer: string | undefined = undefined;
  //If we dont grab previous customer_id, it'll create a new one even if we use the same email address
  const hostCustomer = await hostGetCustomerByUserId(user.id);
  if (hostCustomer && hostCustomer.stripeCustomerId) {
    try {
      const stripeCustomer = await stripeAPI.customers.retrieve(
        hostCustomer.stripeCustomerId,
      );
      if (!stripeCustomer.deleted) customer = stripeCustomer.id;
    } catch {
      //Nothing happens, no customer exists
    }
  }

  const session = await stripeAPI.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customer,
    //Email or Customer can be set, not both (fuck you stripe)
    customer_email: customer ? undefined : user.email || undefined,
    mode: 'subscription',
    return_url: `${serverEnv.FRONTEND_URL}/dashboard/host/servers/add/success?session={CHECKOUT_SESSION_ID}`,
    allow_promotion_codes: true,
  });

  return { clientSecret: session.client_secret, session: session.id };
}
