'use client';

import { useEffect, useState } from 'react';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export function HostCheckout({ clientSecret }: { clientSecret: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stripePromise, setStripePromise] = useState<any>();

  useEffect(() => {
    setStripePromise(
      loadStripe(
        'pk_test_51Mi2D2Jp2M82sHvMBHLCCZqU1QcAVyQkuvLpcNi6SXG41COWCM8LgxRuB5cRn6HZz2MmRVEZ7zN5FVX3dQ22vCW100TzztgNnF',
      ),
    );
  }, []);

  return (
    <div>
      {stripePromise && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
