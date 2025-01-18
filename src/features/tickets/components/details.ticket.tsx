import { notFound } from 'next/navigation';

import { CardDescription } from '@/components/ui/card';
import TicketReplyForm from '@/features/tickets/components/forms/ticket-reply.form';
import TicketMessages from '@/features/tickets/components/messages.ticket';
import TicketStatusSelect from '@/features/tickets/components/select/ticket-status.select';
import ticketsGetSingle from '@/features/tickets/queries/single.get';

export default async function TicketDetails({
  ticketId,
}: {
  ticketId: number;
}) {
  const ticket = await ticketsGetSingle(ticketId);
  if (!ticket) throw notFound();

  return (
    <div className='space-y-4'>
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between'>
          <p className='text-2xl font-bold'>{ticket.title}</p>
          {/* <TicketStatus status={ticket.status} /> */}
          <TicketStatusSelect
            ticketId={ticket.id}
            currentStatus={ticket.status}
          />
        </div>
        <CardDescription>{ticket.category}</CardDescription>
      </div>
      <TicketMessages ticketId={ticket.id} />
      <div className='w-full'>
        <TicketReplyForm ticketId={ticketId} />
      </div>
    </div>
  );
}
