'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Form from 'next/form';
import { toast } from 'sonner';

import AutoExpandingTextareaConform from '@/components/conform/auto-expanding-textarea.conform';
import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
        className='flex flex-col gap-6'
        noValidate
      >
        <Field>
          <InputConform meta={fields.ticketId} type='hidden' />
        </Field>
        <Field>
          <Label htmlFor={fields.message.id}>New Reply</Label>
          <AutoExpandingTextareaConform meta={fields.message} />
          {fields.message.errors && (
            <FieldError>{fields.message.errors}</FieldError>
          )}
        </Field>
        <Button type='submit'>Send</Button>
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
