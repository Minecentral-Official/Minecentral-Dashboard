import { Fragment } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import ticketMessagesGet from '@/features/tickets/queries/messages.get';
import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function TicketMessages({
  ticketId,
}: {
  ticketId: number;
}) {
  const { user } = await validateSession();
  const messages = await ticketMessagesGet(ticketId);
  return (
    <ScrollArea className='h-[350px] w-full rounded-md border'>
      {messages.map((reply, index) => (
        <div
          key={index}
          className={`flex items-start space-x-4 p-4 ${
            index % 2 ? 'bg-gray-200' : 'bg-secondary'
          }`}
        >
          <WrapperAvatar name={reply.user.name} image={reply.user.image} />
          <div className='mt-1 flex-1'>
            <div className='flex items-center justify-between'>
              <h4 className='text-xs font-semibold'>
                {reply.user.name}
                <span className='text-muted-foreground'>
                  {reply.user.id === user.id ? ' (You)' : ''}
                </span>
              </h4>
              <span className='text-xs text-gray-500'>
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
            <p className='text-sm text-gray-700'>
              {reply.message.split('\n').map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
