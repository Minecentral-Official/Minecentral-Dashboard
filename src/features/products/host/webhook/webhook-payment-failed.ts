import Stripe from 'stripe';

//Suspend users server
export async function webhookPaymentFailed(event: Stripe.Event, res: Response) {
  const subscription = event.data.object as Stripe.Subscription;
  console.log('Subscription payment failed!', subscription.customer);
  // res.send({
  //   status: "suspended",
  //   message: "Please pay invoice to continue service!",
  // });
}
