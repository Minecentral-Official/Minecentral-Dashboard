import type { TTicketMessage } from '@/features/tickets/types/ticket-message.type';

export default function DTOTicketMessage({
  createdAt,
  message,
  user,
}: TTicketMessage) {
  return {
    createdAt,
    message,
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}
