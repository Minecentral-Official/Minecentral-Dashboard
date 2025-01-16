import hostGetCustomerByUserId from '@/features/host/queries/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function hostStripeGetPaymentMethods() {
  try {
    const { user } = await validateSession();
    if (!user) throw new Error('no user');
    const hostCustomer = await hostGetCustomerByUserId(user.id);
    if (!hostCustomer) throw new Error('No Subscriptions');
    return await stripeAPI.paymentMethods.list({
      type: 'card',
      customer: hostCustomer.stripeCustomerId,
    });
  } catch (err) {
    console.log(err);
    // res.status(400).send({ error: error.message });
  }
}
