'use client';

import { Badge } from '@/components/ui/badge';
import { useTicketContext } from '@/features/tickets/context/ticket.context';

export default function TicketStatus() {
  const {
    ticket: { status },
  } = useTicketContext();
  return (
    <Badge
      className='hover:cursor-pointer'
      variant={
        status !== 'open' ?
          status === 'closed' ?
            'destructive'
          : 'outline'
        : 'default'
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
