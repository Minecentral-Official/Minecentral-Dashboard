import 'server-only';

import type Stripe from 'stripe';

export function DTOCustomerStripe({
  id,
  subscriptions,
  email,
  created,
}: Stripe.Customer) {
  const subData = subscriptions?.data.map(
    ({ created: sub_created, items: { data } }) => {
      // console.log(data);
      const productData = data.map(
        ({
          plan: { active, interval_count },
          price: { product, unit_amount: price },
        }) => {
          return { active, interval_count, product, price };
        },
      );
      const planData = {
        created: sub_created,
        data: productData,
      };
      return planData;
    },
  );
  return {
    id,
    email,
    created,
    subscriptions: subData?.map(({ created, data }) => {
      return { created, data };
    }),
  };
}
