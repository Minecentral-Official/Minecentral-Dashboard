'use client';

import { Badge } from '@/components/ui/badge';
import { TTicketStatuses } from '@/lib/db/schema';

export default function TicketStatus({
  status,
}: {
  status: (typeof TTicketStatuses)[number];
}) {
  return (
    <Badge
      className='hover:cursor-pointer'
      variant={
        status !== 'open' ?
          status === 'closed' ?
            'destructive'
          : 'secondary'
        : 'default'
      }
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
