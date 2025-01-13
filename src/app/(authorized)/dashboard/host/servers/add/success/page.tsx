import { hostStripeGetSessionData } from '@/features/host/queries/stripe/stripe-session-data.get';

//HUGO: Make this page look nicer, probably cant see this page without making a fake payment
//TRY using this url/session id
//"http://localhost:3000/dashboard/host/servers/add/success?session=cs_test_b1vr8uUMPe6rPUCoZiwY60y5hZqjAatWbOqd8Mk3XSoUZIwuvXxjejtokd"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session: string }>;
}) {
  const { session } = await searchParams;
  const {
    status,
    customer_id,
    payment_status,
    payment_total,
    subscription_id,
  } = await hostStripeGetSessionData(session);
  //I don't know the difference between a session status and payment status, just do something with this data xD
  return (
    <div>
      Payment was successful :D {status} {payment_status} {payment_total}{' '}
      {subscription_id} {customer_id}
    </div>
  );
}
