import { TTicketMessage } from '@/features/tickets/types/ticket-message.type';

import type { ticket, user } from '@/lib/db/schema';

type TicketBase = typeof ticket.$inferSelect;

export type TTicket = TicketBase & {
  user: typeof user.$inferSelect;
  messages: TTicketMessage[];
};
