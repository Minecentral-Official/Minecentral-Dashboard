import Stripe from 'stripe';

//Suspend users server
export async function webhookPaymentFailed(
  event: Stripe.InvoicePaymentFailedEvent,
  res: Response,
) {
  const subscription = event.data.object;
  console.log('Subscription payment failed!', subscription.customer);
  // I'm adding this console log to satisfy eslint. No vars can be unused.
  // We want to eventually use res or remove it from this function
  console.log(res);
  // res.send({
  //   status: "suspended",
  //   message: "Please pay invoice to continue service!",
  // });
}
