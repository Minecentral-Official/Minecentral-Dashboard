import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TicketStatus from '@/features/tickets/components/status.ticket';
import { TicketProvider } from '@/features/tickets/context/ticket.context';
import ticketsGetAll from '@/features/tickets/queries/all.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function TicketListAll() {
  const tickets = await ticketsGetAll();
  const { user } = await validateSession();
  return (
    <div className='space-y-4'>
      {tickets.map((ticket) => (
        <TicketProvider key={ticket.id} ticket={ticket} userId={user.id}>
          <Card className='hover:cursor-pointer hover:bg-secondary'>
            <Link href={`./tickets/${ticket.id}`}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <CardTitle>{ticket.title}</CardTitle>
                  <TicketStatus />
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
        </TicketProvider>
      ))}
    </div>
  );
}
