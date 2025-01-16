'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import ticketsCreateMessage from '@/features/tickets/mutations/create.message';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(10, 'Description must be at least 10 characters'),
});

export default function TicketReply({ ticketId }: { ticketId: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast({
        title: 'Ticket Reply',
        description: 'Your reply to ticket has been submitted.',
      });
      await ticketsCreateMessage({ ...values, ticketId });
      router.push(`./${ticketId}`);
    } catch {
      toast({
        title: 'Error',
        description:
          'There was a problem creating your reply. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Reply</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Submit a new message if you have additional details to provide
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Send Reply</Button>
      </form>
    </Form>
  );
}
