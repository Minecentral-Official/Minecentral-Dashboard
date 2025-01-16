'use client';

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '@/components/ui/button';
import { clientEnv } from '@/lib/env/client.env';

export default function HostStripeChangePaymentMethod() {
  const stripePromise = loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return (
    // <Dialog open={isOpen} onOpenChange={setOpen}>
    // <DialogContent className='w-full'>
    <Elements stripe={stripePromise}>
      <UpdatePaymentMethod />
    </Elements>
    //   </DialogContent>
    // </Dialog>
  );
}

const UpdatePaymentMethod = () => {
  const stripe = useStripe();
  const elements = useElements();
  // const clientSecret = await hostStripeCreateSetupIntent()

  // useEffect(() => {
  //   // Fetch the SetupIntent clientSecret from your backend
  //   fetch('/api/stripe/billing/create-setup-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' }, // Send the customer ID from your backend
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // const cardElement = elements.getElement(CardElement);

    // const clientSecret = await hostStripeCreatePaymentMethodChangeIntent();

    // // Confirm the SetupIntent with the new payment method
    // const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
    //   payment_method: {
    //     card: cardElement!,
    //   },
    // });

    // if (error) {
    //   console.log('[error]', error);
    // } else {
    //   console.log('[SetupIntent]', setupIntent);
    //   // Send setupIntent.payment_method to your server to attach it to the user
    // }
  };

  return (
    <div className='p-6'>
      <form className='space-y-4'>
        <div className='rounded-md border bg-white p-4 shadow-sm'>
          <CardElement options={cardStyle} />
        </div>
        <Button onClick={handleSubmit} className='mx-auto'>
          Update Payment Method
        </Button>
      </form>
    </div>
  );
};

const cardStyle = {
  style: {
    base: {
      color: '#1f2937', // Equivalent to text-gray-800
      fontSize: '16px', // Equivalent to text-base
      fontFamily: '"Inter", sans-serif', // Set custom font if needed
      '::placeholder': {
        color: '#9ca3af', // Equivalent to placeholder-gray-400
      },
    },
    invalid: {
      color: '#f87171', // Equivalent to text-red-400 for invalid input
      iconColor: '#f87171', // Equivalent to text-red-400 for error icon
    },
  },
};
