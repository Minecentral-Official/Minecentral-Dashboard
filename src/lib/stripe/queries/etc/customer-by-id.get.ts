import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function stripeGetCustomer(customerId: string) {
  return await stripeAPI.customers.retrieve(customerId);
}
