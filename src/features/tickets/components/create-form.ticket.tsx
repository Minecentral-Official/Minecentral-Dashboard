'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ticketsCreate from '@/features/tickets/mutations/create.ticket';
import { ticketZod } from '@/features/tickets/schemas/ticket.zod';
import { useToast } from '@/hooks/use-toast';

export default function TicketCreateForm() {
  const { toast } = useToast();
  const [lastResult, action] = useActionState(ticketsCreate, undefined);

  // async function onSubmit(values: z.infer<typeof ticketZod>) {
  //   try {
  //     toast({
  //       title: 'Ticket Created',
  //       description: 'Your support ticket has been successfully created.',
  //     });
  //     await ticketsCreate(values);
  //   } catch {
  //     toast({
  //       title: 'Error',
  //       description:
  //         'There was a problem creating your ticket. Please try again.',
  //       variant: 'destructive',
  //     });
  //   }
  // }

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ticketZod });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Brief description of your issue'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a short, descriptive title for your ticket.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='server-issues'>Server Issues</SelectItem>
                  <SelectItem value='billing'>Billing</SelectItem>
                  <SelectItem value='plugin-support'>Plugin Support</SelectItem>
                  <SelectItem value='general-inquiry'>
                    General Inquiry
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the category that best fits your issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Provide details about your issue'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your issue in detail. Include any relevant information
                that might help us assist you better.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit Ticket</Button>
      </form>
    </Form>
  );
}
