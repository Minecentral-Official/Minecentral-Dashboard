import type { TicketMessage } from '@/features/tickets/schemas/ticket-message.type';
import type { ticket, user } from '@/lib/db/schema';

type TicketBase = typeof ticket.$inferSelect;

export type Ticket = TicketBase & {
  user: typeof user.$inferSelect;
  messages: TicketMessage[];
};
