import type { ticketMessage, user } from '@/lib/db/schema';

type TicketMessageBase = typeof ticketMessage.$inferSelect;

export type TicketMessage = TicketMessageBase & {
  user: typeof user.$inferSelect;
  // ticket: Ticket;
};
