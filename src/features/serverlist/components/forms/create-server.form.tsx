'use client';

import { useActionState, useEffect } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import serverCreateAction from '@/features/serverlist/actions/create-server.action';
import { S_ServerCreate } from '@/features/serverlist/schemas/zod/s-server-create.zod';

export default function ServerCreateForm() {
  const [actionState, action] = useActionState(serverCreateAction, undefined);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ServerCreate,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid', { id: 'create-server' });
      } else {
        toast.loading('Creating project...', { id: 'create-server' });
        //Clear Editor Cache
        // window?.localStorage.removeItem('editorContent');
      }
      return submission;
    },
  });

  const portHandler = useInputControl(fields.port);

  // Show toast when state changes
  useEffect(() => {
    if (actionState?.success) {
      toast.success(actionState.message, {
        id: 'create-server',
      });
    } else if (actionState?.success === false) {
      toast.error(actionState?.message, { id: 'create-server' });
    }
  }, [actionState]);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <Field>
        <Label htmlFor={fields.title.id}>Server Name</Label>
        <InputConform meta={fields.title} type='text' />
        {fields.title.errors && <FieldError>{fields.title.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.slug.id}>URL Slug</Label>
        <InputConform meta={fields.slug} type='text' />
        {fields.slug.errors && <FieldError>{fields.slug.errors}</FieldError>}
        <p className=''>
          <span className='text-accent-foreground/55'>{`https://minecentral.net/serverlist/`}</span>
          {fields.slug.value}
        </p>
      </Field>

      <Field>
        <Label htmlFor={fields.ip.id}>Summary</Label>
        <p className='text-accent-foreground'>
          Short sentence describing your server.
        </p>
        <InputConform meta={fields.ip} type='text' placeholder='192.168.0.1' />
        <Input
          type='number'
          placeholder='25565'
          min={0}
          max={65535}
          onChange={(e) => portHandler.change(e.currentTarget.value)}
        />

        {fields.ip.errors && <FieldError>{fields.ip.errors}</FieldError>}
        {fields.port.errors && <FieldError>{fields.port.errors}</FieldError>}
      </Field>

      <Button>Create Realm</Button>
    </form>
  );
}
