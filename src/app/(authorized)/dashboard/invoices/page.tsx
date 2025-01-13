import {
  hostStripeGetInvoices,
  TPurchaseInvoiceData,
} from '@/features/host/queries/stripe/stripe-invoices.get';

//HUGO: Create invoice table with all the invoice data here!
export default async function GeneralInvoicesPage() {
  const invoices = await hostStripeGetInvoices();
  if (!invoices) return <>No Invoices</>;
  return (
    <>
      {invoices.map((invoice) => (
        <InvoiceRow invoice={invoice} key={invoice.id} />
      ))}
    </>
  );
}

function InvoiceRow({
  invoice: {
    //UNCOMMENT when you use this component
    // amount_due,
    // amount_paid,
    // amount_remaining,
    // created,
    // due_date,
    // id,
    // paid,
    // status,
  },
}: {
  invoice: TPurchaseInvoiceData;
}) {
  //Create a Row thing here
  return <></>;
}
