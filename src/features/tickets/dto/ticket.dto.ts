import DTOTicketMessage from '@/features/tickets/dto/ticket-message.dto';
import { TTicket } from '@/features/tickets/types/ticket.type';

export default function DTOTicket({
  createdAt,
  category,
  id,
  status,
  title,
  user,
  messages,
}: TTicket) {
  return {
    createdAt,
    category,
    id,
    status,
    title,
    messages: messages.map((message) => DTOTicketMessage(message)),
    author: {
      image: user.image,
      name: user.name,
      id: user.id,
    },
  };
}
