import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import { DTOInvoiceStripe } from '@/lib/stripe/dto/invoice.dto';

export default async function stripeGetInvoicesByCustomerId(
  customerId: string,
) {
  const stringInvoices = await stripeAPI.invoices.list({
    customer: customerId,
  });
  const invoices = stringInvoices.data.map((invoice) =>
    DTOInvoiceStripe(invoice),
  );
  return invoices;
}
