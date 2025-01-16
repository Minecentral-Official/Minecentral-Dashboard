import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Ticket } from '@/lib/db/schema';

export default async function TicketMessages({ ticket }: { ticket: Ticket }) {
  return (
    <div>
      <h2 className='mb-2 text-lg font-bold'>Messages</h2>
      <div className='mb-4'>
        {ticket.messages.map((msg) => (
          <Card key={msg.id} className='border-b p-2'>
            <CardHeader>
              <div className='flex flex-row justify-between'>
                <CardTitle>{msg.message}</CardTitle>
                <CardDescription>{msg.user.name}</CardDescription>
              </div>
              <CardDescription>
                {new Date(msg.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
