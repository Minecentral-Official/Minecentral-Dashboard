import hostStripeGetPaymentMethods from '@/features/host/queries/stripe/payment-methods.get';

export default async function HostStripeListPaymentMethods() {
  const methods = await hostStripeGetPaymentMethods();

  return (
    <div className='flex flex-col'>
      {methods!.data.map((method) => (
        <div className='flex items-center space-x-4' key={method.id}>
          <div className='flex h-6 w-10 items-center justify-center rounded bg-gray-200'>
            {method.card?.brand}
          </div>
          <div>
            <p className='font-medium'>•••• {method.card?.last4}</p>
            <p className='text-sm text-gray-500'>
              Expires {method.card?.exp_month}/{method.card?.exp_year}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
