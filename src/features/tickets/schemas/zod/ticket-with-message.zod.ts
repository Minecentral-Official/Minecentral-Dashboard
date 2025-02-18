import { ticketCreateMessageZod } from '@/features/tickets/schemas/zod/ticket-message.zod';
import { ticketCreateZod } from '@/features/tickets/schemas/zod/ticket.zod';

export const ticketCreateWithMessageZod = ticketCreateZod.merge(
  ticketCreateMessageZod,
);
