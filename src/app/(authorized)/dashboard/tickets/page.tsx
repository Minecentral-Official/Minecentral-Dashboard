import Link from 'next/link';

import { Button } from '@/components/ui/button';
import TicketListAll from '@/features/tickets/components/list-all.ticket';

export default function TicketsPage() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Support Tickets</h1>
        <Button asChild>
          <Link href='./tickets/create'>Create New Ticket</Link>
        </Button>
      </div>
      <TicketListAll />
    </div>
  );
}
