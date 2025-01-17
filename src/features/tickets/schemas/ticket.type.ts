import type { ticket, TicketMessage, user } from '@/lib/db/schema';

type TicketBase = typeof ticket.$inferSelect;

export type Ticket = TicketBase & {
  user: typeof user.$inferSelect;
  messages: TicketMessage[];
};
