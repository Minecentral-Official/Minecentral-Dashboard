'use client';

import { useActionState, useEffect } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { TextareaConform } from '@/components/conform/textarea.conform';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import serverUpdateGeneralAction from '@/features/serverlist/actions/update-server-general.action';
import { S_ServerUpdateVotifier } from '@/features/serverlist/schemas/zod/s-server-update-votifier.zod';
import { T_DTOServer_Votifier } from '@/features/serverlist/types/t-dto-server.type';

export default function ServerUpdateVotifierForm({
  serverId,
  data,
}: {
  serverId: string;
  data: T_DTOServer_Votifier | undefined;
}) {
  const [actionState, action] = useActionState(
    serverUpdateGeneralAction,
    undefined,
  );

  // Show toast when state changes
  useEffect(() => {
    if (actionState?.success) {
      toast.success(actionState.message, {
        id: 'update-realm',
      });
    } else if (actionState?.success === false) {
      toast.error(actionState?.message, { id: 'update-realm' });
    }
  }, [actionState]);

  const defaultValue = {
    id: serverId,
    ip: data?.ip || '',
    port: data?.port || '',
    publicKey: data?.publicKey || '',
    enabled: data?.enabled || false,
  };

  const [form, fields] = useForm({
    lastResult: undefined,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ServerUpdateVotifier,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid, please fix any errors', {
          id: 'update-realm',
        });
        console.log(submission.error);
      } else {
        toast.loading('Updating realm...', { id: 'update-realm' });
      }
      return submission;
    },
    defaultValue,
  });

  const portHandler = useInputControl(fields.port);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={serverId} />

      <Field>
        <Label htmlFor={fields.ip.id}>IP Address</Label>
        <InputConform meta={fields.ip} type='text' placeholder='192.168.0.1' />
        {fields.ip.errors && <FieldError>{fields.ip.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.port.id}>Port</Label>
        <Input
          type='number'
          placeholder='8080'
          min={0}
          max={65535}
          onChange={(e) => portHandler.change(e.currentTarget.value)}
        />
        {fields.port.errors && <FieldError>{fields.port.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.publicKey.id}>Public Votifier Key</Label>
        <TextareaConform meta={fields.publicKey} rows={10} />
        {fields.publicKey.errors && (
          <FieldError>{fields.publicKey.errors}</FieldError>
        )}
      </Field>

      <Button
        disabled={
          JSON.stringify(form.value) === JSON.stringify(form.initialValue)
        }
      >
        Save Changes
      </Button>
    </form>
  );
}
