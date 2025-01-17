'use client';

import { Badge } from '@/components/ui/badge';
import { ticketStatusConfig } from '@/features/tickets/config/ticket-status.config';

export default function TicketStatus({
  status,
}: {
  status: (typeof ticketStatusConfig)[number];
}) {
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
