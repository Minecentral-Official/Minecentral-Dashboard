import Stripe from 'stripe';

import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

export type TPurchaseInvoiceData = {
  amount_due: number;
  amount_paid: number;
  paid: boolean;
  amount_remaining: number;
  id: string;
  status: Stripe.Invoice.Status | null;
  created: number;
  due_date: number | null;
};

export async function hostStripeGetInvoices(): Promise<
  TPurchaseInvoiceData[] | null
> {
  const { user } = await validateSession();
  const hostCustomer = await hostGetCustomerByUserId(user.id);
  if (!hostCustomer) return null;
  const { stripeCustomerId } = hostCustomer;
  const stringInvoices = await stripeAPI.invoices.list({
    customer: stripeCustomerId,
  });
  const invoices = stringInvoices.data.map(
    ({
      amount_due,
      amount_paid,
      paid,
      amount_remaining,
      id,
      status,
      created,
      due_date,
    }) => {
      return {
        amount_due,
        amount_paid,
        paid,
        amount_remaining,
        id,
        status,
        created,
        due_date,
      };
    },
  );
  return invoices;
}
