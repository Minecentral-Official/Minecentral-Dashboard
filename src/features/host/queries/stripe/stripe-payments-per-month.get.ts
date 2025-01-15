import Stripe from 'stripe';

import hostGetCustomerByUserId from '@/features/host/queries/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import stripeGetCustomer from '@/lib/stripe/queries/etc/customer-by-id.get';

export async function hostStripeGetPaymentsPerMonth() {
  const { user } = await validateSession();
  const hostCustomer = await hostGetCustomerByUserId(user.id);

  if (!hostCustomer) return 0;
  const customerObj = await stripeGetCustomer(hostCustomer.stripeCustomerId);

  let totalMonthlyPayment = 0;

  //Deleted object or not exist

  if (customerObj.object !== 'customer') return 0;

  const customer = customerObj as Stripe.Customer;
  const subscriptions = customer.subscriptions;

  console.log('Sub id retrieved', subscriptions);
  //No subscriptions
  if (!subscriptions) return 0;
  for (const subscription of subscriptions.data) {
    for (const priceId of subscription.items.data) {
      totalMonthlyPayment += priceId.price.unit_amount || 0;
    }
  }

  return totalMonthlyPayment;
  // const total = subscriptions.reduce(sub => await stripeAPI.subscriptions.retrieve(sub.stripeSubscriptionId))
}
