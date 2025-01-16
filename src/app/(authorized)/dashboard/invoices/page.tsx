import { Check, X } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  hostStripeGetInvoices,
  TPurchaseInvoiceData,
} from '@/features/host/queries/stripe/invoices.get';

//HUGO: Create invoice table with all the invoice data here!
export default async function GeneralInvoicesPage() {
  const invoices = await hostStripeGetInvoices();
  if (!invoices) return <>No Invoices</>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoices</TableHead>
          <TableHead>Amount Due</TableHead>

          <TableHead>Created</TableHead>

          <TableHead className='text-end'>Paid</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <InvoiceRow {...invoice} key={invoice.id} />
        ))}
      </TableBody>
    </Table>
  );
}

function InvoiceRow({
  // UNCOMMENT when you use this component
  amount_due,
  // amount_paid,
  // amount_remaining,
  created,
  // due_date,
  id,
  paid,
  status,
}: TPurchaseInvoiceData) {
  //Create a Row thing here
  return (
    <TableRow>
      <TableCell className='font-medium'>{id}</TableCell>
      <TableCell>$ {amount_due / 100}</TableCell>
      {/* ALAIN: What does this date number represent? I tried formatting it and it gave me a date in the 1970s LOL */}
      <TableCell>
        {new Date(created * 1000).toLocaleDateString('en-US')}
      </TableCell>

      <TableCell className='text-end'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {paid ?
                <Check className='mr-1 h-4 w-4' />
              : <X className='mr-1 h-4 w-4' />}
            </TooltipTrigger>
            <TooltipContent>
              <div>
                {status && status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
}
