'use client';

import { useActionState, useRef } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Form from 'next/form';

import { InputConform } from '@/components/conform/input.conform';
import { SelectConform } from '@/components/conform/select.conform';
import { ticketStatusConfig } from '@/features/tickets/config/ticket-status.config';
import { useTicketContext } from '@/features/tickets/context/ticket.context';
import ticketChangeStatus from '@/features/tickets/mutations/change-status.ticket';
import { ticketUpdateStatusZod } from '@/features/tickets/schemas/zod/ticket-status.zod';

const statusSelectData = ticketStatusConfig.map((category) => ({
  value: category,
  name: category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

export default function TicketStatusSelect() {
  const {
    ticket: { status: currentStatus, id: ticketId },
  } = useTicketContext();
  const [lastResult, action] = useActionState(ticketChangeStatus, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ticketUpdateStatusZod });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    defaultValue: {
      id: ticketId.toString(),
      status: currentStatus,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      ref={formRef}
      noValidate
    >
      <InputConform meta={fields.id} type='hidden' />
      <SelectConform
        placeholder='Select your status...'
        meta={fields.status}
        items={statusSelectData}
        onValueChange={() => formRef.current?.requestSubmit()}
      />
    </Form>
  );
}
