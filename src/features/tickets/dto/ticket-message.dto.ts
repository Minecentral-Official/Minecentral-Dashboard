import type { TicketMessage } from '@/features/tickets/schemas/ticket-message.type';

export default function DTOTicketMessage({
  createdAt,
  message,
  user,
}: TicketMessage) {
  return {
    createdAt,
    message,
    user: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}
