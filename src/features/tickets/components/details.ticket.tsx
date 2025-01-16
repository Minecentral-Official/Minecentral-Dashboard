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
    <div className='p-4'>
      <div className='flex flex-row justify-between'>
        <h2 className='text-lg font-medium'>{ticket.title}</h2>
        <TicketStatus status={ticket.status} />
      </div>
      <TicketMessages ticket={ticket} />
      <TicketReply ticketId={ticket.id} />
    </div>
  );
}
