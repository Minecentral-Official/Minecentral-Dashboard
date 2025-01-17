'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ArrowUp } from 'lucide-react';
import Form from 'next/form';
import { toast } from 'sonner';

import AutoExpandingTextareaConform from '@/components/conform/auto-expanding-textarea.conform';
import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import createTicketMessage from '@/features/tickets/mutations/ticket-message.create';
import { insertTicketMessageZod } from '@/features/tickets/schemas/ticket-message.zod';

export default function ReplyTicketForm({ ticketId }: { ticketId: number }) {
  // const router = useRouter();
  // const { toast } = useToast();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     message: '',
  //   },
  // });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     toast({
  //       title: 'Ticket Reply',
  //       description: 'Your reply to ticket has been submitted.',
  //     });
  //     await ticketsCreateMessage({ ...values, ticketId });
  //     router.push(`./${ticketId}`);
  //   } catch {
  //     toast({
  //       title: 'Error',
  //       description:
  //         'There was a problem creating your reply. Please try again.',
  //       variant: 'destructive',
  //     });
  //   }
  // }

  const [lastResult, action] = useActionState(createTicketMessage, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: insertTicketMessageZod,
      });

      if (submission.status !== 'success') {
        toast.error('Form data invalid', { id: 'create-ticket' });
      } else {
        toast.loading('Creating Your Ticket...', { id: 'create-ticket' });
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

  return (
    <div>
      <Form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className='flex flex-col gap-2'
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
            className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 px-0'
          >
            <ArrowUp />
          </Button>
        </div>
      </Form>
    </div>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
    //     <FormField
    //       control={form.control}
    //       name='message'
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>New Reply</FormLabel>
    //           <FormControl>
    //             <Textarea {...field} />
    //           </FormControl>
    //           <FormDescription>
    //             Submit a new message if you have additional details to provide
    //           </FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <Button type='submit'>Send Reply</Button>
    //   </form>
    // </Form>
  );
}
