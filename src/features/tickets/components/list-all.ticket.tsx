import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ticketsGetAll from '@/features/tickets/queries/all.get';

export default async function TicketListAll() {
  const tickets = await ticketsGetAll();
  return (
    <div className='space-y-4'>
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className='hover:cursor-pointer hover:bg-secondary'
        >
          <Link href={`./tickets/${ticket.id}`}>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <CardTitle>{ticket.title}</CardTitle>
                <Badge
                  variant={ticket.status === 'open' ? 'default' : 'secondary'}
                >
                  {ticket.status}
                </Badge>
              </div>
              <CardDescription>
                Ticket #{ticket.id} - {ticket.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{ticket.messages[0]?.message}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
