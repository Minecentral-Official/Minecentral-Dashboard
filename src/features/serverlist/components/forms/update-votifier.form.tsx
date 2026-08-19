'use client';

import { useActionState, useEffect } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { TextareaConform } from '@/components/conform/textarea.conform';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import serverUpdateVotifierAction from '@/features/serverlist/actions/update-server-votifier.action';
import { S_ServerUpdateVotifier } from '@/features/serverlist/schemas/zod/s-server-update-votifier.zod';
import { T_DTOServer_Votifier } from '@/features/serverlist/types/t-dto-server.type';

export default function ServerUpdateVotifierForm({
  serverId,
  data,
  voteCooldownHours,
}: {
  serverId: string;
  data: T_DTOServer_Votifier | undefined;
  voteCooldownHours: number;
}) {
  const [actionState, action] = useActionState(
    serverUpdateVotifierAction,
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
    voteCooldownHours,
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
        <label className='flex items-center gap-2 text-sm font-medium'>
          <Checkbox
            name={fields.enabled.name}
            defaultChecked={data?.enabled ?? false}
          />
          Enable reward delivery
        </label>
      </Field>

      <Field>
        <Label htmlFor={fields.ip.id}>IP Address</Label>
        <InputConform meta={fields.ip} type='text' placeholder='192.168.0.1' />
        {fields.ip.errors && <FieldError>{fields.ip.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.port.id}>Port</Label>
        <Input
          name={fields.port.name}
          type='number'
          placeholder='8080'
          min={0}
          max={65535}
          defaultValue={data?.port ?? ''}
          onChange={(e) => portHandler.change(e.currentTarget.value)}
        />
        {fields.port.errors && <FieldError>{fields.port.errors}</FieldError>}
      </Field>

      <Field>
        <Label>Vote Cooldown</Label>
        <Select
          name={fields.voteCooldownHours.name}
          defaultValue={String(voteCooldownHours)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[8, 12, 16, 20, 24].map((hours) => (
              <SelectItem key={hours} value={String(hours)}>
                {hours} hours
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fields.voteCooldownHours.errors && (
          <FieldError>{fields.voteCooldownHours.errors}</FieldError>
        )}
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
