import { ScrollArea } from '@/components/ui/scroll-area';
import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';
import validateSession from '@/lib/auth/helpers/validate-session';
import { Ticket } from '@/lib/db/schema';

export default async function TicketMessages({ ticket }: { ticket: Ticket }) {
  const { user } = await validateSession();
  return (
    <div>
      <h2 className='mb-2 text-lg font-bold'>Messages</h2>
      <ScrollArea className='h-[350px] w-full rounded-md border'>
        {ticket.messages.map((reply, index) => (
          <div
            key={reply.id}
            className={`flex items-start space-x-4 p-4 ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <WrapperAvatar name={reply.user.name} image={reply.user.image} />
            <div className='flex-1 space-y-1'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold'>
                  {reply.user.name}
                  <span className='font-thin'>
                    {reply.user.id === user.id ? ' (You)' : ''}
                  </span>
                </h4>
                <span className='text-xs text-gray-500'>
                  {new Date(reply.createdAt).toLocaleString()}
                </span>
              </div>
              <p className='text-sm text-gray-700'>{reply.message}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
