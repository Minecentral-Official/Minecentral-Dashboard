import type { ticketMessage, userTable } from '@/lib/db/schema';

type TicketMessageBase = typeof ticketMessage.$inferSelect;

export type TTicketMessage = TicketMessageBase & {
  user: typeof userTable.$inferSelect;
};
