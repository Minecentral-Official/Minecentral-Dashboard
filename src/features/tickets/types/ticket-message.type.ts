import type { ticketMessage, user } from '@/lib/db/schema';

type TicketMessageBase = typeof ticketMessage.$inferSelect;

export type TTicketMessage = TicketMessageBase & {
  user: typeof user.$inferSelect;
};
