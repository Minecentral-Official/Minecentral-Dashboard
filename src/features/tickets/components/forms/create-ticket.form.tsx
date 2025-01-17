'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { SelectConform } from '@/components/conform/select.conform';
import { TextareaConform } from '@/components/conform/textarea.conform';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ticketCategoryConfig } from '@/features/tickets/config/ticket-category.config';
import createTicketWithMessage from '@/features/tickets/mutations/ticket-with-message.create';
import { insertTicketWithMessageZod } from '@/features/tickets/schemas/ticket-with-message.zod';

export default function CreateTicketForm() {
  const [lastResult, action] = useActionState(
    createTicketWithMessage,
    undefined,
  );
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: insertTicketWithMessageZod,
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
      title: '',
      message: '',
      category: undefined,
    },
  });

  const categorySelectData = ticketCategoryConfig.map((category) => ({
    value: category,
    name: category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));

  return (
    <div>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        className='flex flex-col gap-6'
        action={action}
        noValidate
      >
        <Field>
          <Label htmlFor={fields.title.id}>Title</Label>
          <InputConform meta={fields.title} type='text' />
          {fields.title.errors && (
            <FieldError>{fields.title.errors}</FieldError>
          )}
        </Field>
        <Field>
          <Label htmlFor={fields.category.id}>Category</Label>
          <SelectConform
            placeholder='Select a category'
            meta={fields.category}
            items={categorySelectData}
          />

          {fields.category.errors && (
            <FieldError>{fields.category.errors}</FieldError>
          )}
        </Field>
        <Field>
          <Label htmlFor={fields.message.id}>Message</Label>
          <TextareaConform meta={fields.message} />
          {fields.message.errors && (
            <FieldError>{fields.message.errors}</FieldError>
          )}
        </Field>
        {/* <FormField
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
        /> */}
        <Button>Submit Ticket</Button>
      </form>
    </div>
  );
}
