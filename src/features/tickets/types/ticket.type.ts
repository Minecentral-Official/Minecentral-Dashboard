import { TTicketMessage } from '@/features/tickets/types/ticket-message.type';

import type { ticket, userTable } from '@/lib/db/schema';

type TicketBase = typeof ticket.$inferSelect;

export type TTicket = TicketBase & {
  user: typeof userTable.$inferSelect;
  messages: TTicketMessage[];
};
