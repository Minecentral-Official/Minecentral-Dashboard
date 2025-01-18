import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function hostStripeCreatePaymentMethodChangeIntent(
  paymentMethodId: string,
) {
  try {
    const { user } = await validateSession();
    if (!user) throw new Error('no user');
    const hostCustomer = await hostGetCustomerByUserId(user.id);
    if (!hostCustomer) throw new Error('No Subscriptions');

    const customerId = hostCustomer.stripeCustomerId;

    // const paymentMethodId = req.body.paymentMethodId; // This comes from the frontend (setupIntent.payment_method)

    // Attach the new payment method to the customer
    await stripeAPI.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the new payment method as the default for the customer
    await stripeAPI.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // If the customer has a subscription, ensure the new payment method is used for future payments
    const subscriptions = await stripeAPI.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];

      // Update subscription with the new payment method
      await stripeAPI.subscriptions.update(subscription.id, {
        default_payment_method: paymentMethodId,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    // res.status(400).send({ error: error.message });
  }
}
