import { User } from 'better-auth';

import { stripeAPI } from '@/lib/stripe/api/stripe.api';

export async function stripeSessionCreate(user: User, priceId: string) {
  const customer: string | undefined = undefined;
  // if (user.stripeCustomerId) {
  //   try {
  //     const stripeCustomer = await stripeAPI.customers.retrieve(
  //       req.user.stripeCustomerId
  //     );
  //     if (!stripeCustomer.deleted) customer = stripeCustomer.id;
  //   } catch (err) {
  //     console.log(
  //       "Returning client:",
  //       req.user.email,
  //       req.user.stripeCustomerId
  //     );
  //     //Nothing happens, no customer exists
  //   }
  // }

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
    return_url: `${'https://localhost:3000'}/checkout/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    // automatic_tax: { enabled: true },
    // billing_address_collection: "auto",
    allow_promotion_codes: true,
  });

  return { clientSecret: session.client_secret, session: session.id };
}
