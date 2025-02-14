'use client';

import { Fragment } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useTicketContext } from '@/features/tickets/context/ticket.context';
import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';

export default function TicketMessages() {
  const {
    ticket: { messages },
    userId,
  } = useTicketContext();
  return (
    <ScrollArea className='h-[350px] w-full rounded-md border'>
      {messages.map(
        ({ author: { image, name, id }, createdAt, message }, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 p-4 ${
              index % 2 ? 'bg-gray-200' : 'bg-secondary'
            }`}
          >
            <WrapperAvatar name={name} image={image} />
            <div className='mt-1 flex-1'>
              <div className='flex items-center justify-between'>
                <h4 className='text-xs font-semibold'>
                  {name}
                  <span className='text-muted-foreground'>
                    {id === userId ? ' (You)' : ''}
                  </span>
                </h4>
                <span className='text-xs text-gray-500'>
                  {new Date(createdAt).toLocaleString()}
                </span>
              </div>
              <p className='text-sm text-gray-700'>
                {message.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
        ),
      )}
    </ScrollArea>
  );
}
