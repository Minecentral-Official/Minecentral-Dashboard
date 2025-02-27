'use client';

import { useActionState, useEffect, useRef } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ArrowUp } from 'lucide-react';
import Form from 'next/form';
import { toast } from 'sonner';

import AutoExpandingTextareaConform from '@/components/conform/auto-expanding-textarea.conform';
import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import ticketCreateMessage from '@/features/tickets/mutations/ticket-message.create';
import { ticketCreateMessageZod } from '@/features/tickets/schemas/zod/ticket-message.zod';

export default function TicketReplyForm({ ticketId }: { ticketId: number }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [lastResult, action] = useActionState(ticketCreateMessage, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: ticketCreateMessageZod,
      });

      if (submission.status !== 'success') {
        toast.error('Please input a message', { id: 'create-ticket-message' });
      } else {
        toast.loading('Messaging...', { id: 'create-ticket-message' });
      }
      return submission;
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    defaultValue: {
      message: '',
      // passing this as string to validation
      // zod will transform this to a number for us
      ticketId: ticketId.toString(),
    },
  });

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Prevent default Enter key behavior
      if (e.key === 'Enter') {
        e.preventDefault();
        // console.log('enter key was pressed');
        // Add a new line only when Shift + Enter is pressed
        if (!e.shiftKey) {
          // console.log('proper keys were pressed');
          formRef.current?.requestSubmit();
        }
      }
    }

    document.addEventListener('keydown', handleKeydown);

    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div>
      <Form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className='flex flex-col gap-2'
        ref={formRef}
        noValidate
      >
        <Field>
          <InputConform meta={fields.ticketId} type='hidden' />
        </Field>
        <div className='relative'>
          <AutoExpandingTextareaConform
            meta={fields.message}
            placeholder='Reply'
          />
          {fields.message.errors && (
            <FieldError>{fields.message.errors}</FieldError>
          )}
          <Button
            type='submit'
            className='absolute bottom-1 right-1 h-7 w-7 px-0'
          >
            <ArrowUp />
          </Button>
        </div>
      </Form>
    </div>
  );
}
