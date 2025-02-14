import { notFound } from 'next/navigation';

import { CardDescription } from '@/components/ui/card';
import TicketReplyForm from '@/features/tickets/components/forms/ticket-reply.form';
import TicketMessages from '@/features/tickets/components/messages.ticket';
import TicketStatusSelect from '@/features/tickets/components/select/ticket-status.select';
import { TicketProvider } from '@/features/tickets/context/ticket.context';
import ticketsGetSingle from '@/features/tickets/queries/single.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function TicketDetails({
  ticketId,
}: {
  ticketId: number;
}) {
  const ticket = await ticketsGetSingle(ticketId);
  const {
    user: { id: userId },
  } = await validateSession();
  if (!ticket) throw notFound();

  return (
    <TicketProvider ticket={ticket} userId={userId}>
      <div className='space-y-4'>
        <div className='flex flex-col'>
          <div className='flex flex-row justify-between'>
            <p className='text-2xl font-bold'>{ticket.title}</p>
            <TicketStatusSelect />
          </div>
          <CardDescription>{ticket.category}</CardDescription>
        </div>
        <TicketMessages />

        <div className='w-full'>
          <TicketReplyForm ticketId={ticketId} />
        </div>
      </div>
    </TicketProvider>
  );
}
