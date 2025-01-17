import { insertTicketMessageZod } from '@/features/tickets/schemas/ticket-message.zod';
import { insertTicketZod } from '@/features/tickets/schemas/ticket.zod';

export const insertTicketWithMessageZod = insertTicketZod.merge(
  insertTicketMessageZod.omit({ ticketId: true }),
);
