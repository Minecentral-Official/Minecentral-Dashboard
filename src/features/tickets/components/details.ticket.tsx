import { CardDescription } from '@/components/ui/card';
import TicketMessages from '@/features/tickets/components/messages.ticket';
import TicketReply from '@/features/tickets/components/reply.ticket';
import TicketStatus from '@/features/tickets/components/status.ticket';
import ticketsGetSingle from '@/features/tickets/queries/single.get';

export default async function TicketDetails({
  ticketId,
}: {
  ticketId: number;
}) {
  const ticket = await ticketsGetSingle(ticketId);
  if (!ticket) return <>error</>;

  return (
    <div className='space-y-4'>
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between'>
          <p className='text-3xl font-bold'>{ticket.title}</p>
          <TicketStatus status={ticket.status} />
        </div>
        <CardDescription>{ticket.category}</CardDescription>
      </div>
      <TicketMessages ticket={ticket} />
      <div className='w-full'>
        <TicketReply ticketId={ticket.id} />
      </div>
    </div>
  );
}
