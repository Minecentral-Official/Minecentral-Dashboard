import type Stripe from 'stripe';

export function DTOInvoiceStripe({
  amount_due,
  amount_paid,
  paid,
  amount_remaining,
  id,
  status,
  created,
  due_date,
}: Stripe.Invoice) {
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
}
