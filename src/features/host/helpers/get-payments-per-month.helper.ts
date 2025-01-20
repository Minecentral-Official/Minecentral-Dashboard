import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import stripeGetCustomer from '@/lib/stripe/queries/etc/customer-by-id.get';

import 'server-only';

export async function hostHelperGetPaymentsPerMonth() {
  const { user } = await validateSession();
  const hostCustomer = await hostGetCustomerByUserId(user.id);

  if (!hostCustomer) return 0;
  const customer = await stripeGetCustomer(hostCustomer.stripeCustomerId);

  let totalMonthlyPayment = 0;

  const subscriptions = customer.subscriptions;

  // console.log('Sub id retrieved', subscriptions);
  //No subscriptions
  if (!subscriptions) return 0;
  for (const subscription of subscriptions) {
    for (const plan of subscription.data) {
      totalMonthlyPayment += plan?.price || 0;
    }
  }

  return totalMonthlyPayment;
}
