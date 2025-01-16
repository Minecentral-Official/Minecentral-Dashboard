import HostStripeChangePaymentMethod from '@/features/host/components/stripe/change-payment-method';
import HostStripeListPaymentMethods from '@/features/host/components/stripe/list-payment-methods';

export default function AccountPage() {
  return (
    <div className='space-y-6'>
      <HostStripeChangePaymentMethod />
      <HostStripeListPaymentMethods />
    </div>
  );
}
