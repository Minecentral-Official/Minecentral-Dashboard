'use client';

import { useActionState, useEffect } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { RiDiscordLine } from '@remixicon/react';
import { BugIcon, CodeIcon, DollarSignIcon, FilesIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import projectUpdateLinksAction from '@/features/resources/actions/update-resource-links.action';
import { S_ProjectUpdateLinks } from '@/features/resources/schemas/zod/s-project-update-links.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceUpdateLinksForm({
  linkDiscord,
  linkDonation,
  linkIssues,
  linkSource,
  linkSupport,
  id: resourceId,
}: Pick<
  T_DTOResource,
  | 'id'
  | 'linkDiscord'
  | 'linkDonation'
  | 'linkIssues'
  | 'linkSource'
  | 'linkSupport'
>) {
  const [actionState, action] = useActionState(
    projectUpdateLinksAction,
    undefined,
  );

  const defaultValue = {
    linkDiscord,
    linkDonation,
    linkIssues,
    linkSource,
    linkSupport,
    id: resourceId,
  };

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectUpdateLinks,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Form data invalid', { id: 'update-resource' });
      } else {
        toast.loading('Updating project...', { id: 'update-resource' });
      }
      return submission;
    },
    defaultValue,
  });

  // Show toast when state changes
  useEffect(() => {
    if (actionState?.success) {
      toast.success(actionState.message, {
        id: 'update-resource',
      });
    } else if (actionState?.success === false) {
      toast.error(actionState?.message, { id: 'update-resource' });
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
      <input type='hidden' name={fields.id.name} value={resourceId} />

      <Field>
        <Label htmlFor={fields.linkSource.id} className='flex gap-2'>
          <CodeIcon className='h-4 w-4' />
          Source Code
        </Label>
        <p className='text-sm'>
          Repository where your resource source code can be found
        </p>
        <InputConform
          meta={fields.linkSource}
          type='text'
          placeholder='Enter an appropiate URL'
        />
        {fields.linkSource.errors && (
          <FieldError>{fields.linkSource.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.linkIssues.id} className='flex gap-2'>
          <BugIcon className='h-4 w-4' />
          Issue Tracker
        </Label>
        <p className='text-sm'>
          A place for users to report bugs, issues or concerns regarding your
          resource
        </p>
        <InputConform
          meta={fields.linkIssues}
          type='text'
          placeholder='Enter an appropiate URL'
        />
        {fields.linkIssues.errors && (
          <FieldError>{fields.linkIssues.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.linkDiscord.id} className='flex gap-2'>
          <RiDiscordLine className='h-4 w-4' />
          Discord Invite Link
        </Label>
        <p className='text-sm'>An invitation link to your Discord channel</p>
        <InputConform
          meta={fields.linkDiscord}
          type='text'
          placeholder='Enter an appropiate URL'
        />
        {fields.linkDiscord.errors && (
          <FieldError>{fields.linkDiscord.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.linkSupport.id} className='flex gap-2'>
          <FilesIcon className='h-4 w-4' />
          Wiki/Help Link
        </Label>
        <p className='text-sm'>
          A page where users can view information, documentation and/or help for
          this resource
        </p>
        <InputConform
          meta={fields.linkSupport}
          type='text'
          placeholder='Enter an appropiate URL'
        />
        {fields.linkSupport.errors && (
          <FieldError>{fields.linkSupport.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.linkDonation.id} className='flex gap-2'>
          <DollarSignIcon className='h-4 w-4' />
          Donation Link
        </Label>
        <p className='text-sm'>
          Add a donation link where users can support you directly
        </p>
        <InputConform
          meta={fields.linkDonation}
          type='text'
          placeholder='Enter an appropiate URL'
        />
        {fields.linkDonation.errors && (
          <FieldError>{fields.linkDonation.errors}</FieldError>
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
