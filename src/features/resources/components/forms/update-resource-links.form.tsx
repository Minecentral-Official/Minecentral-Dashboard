'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import projectUpdateDescriptionAction from '@/features/resources/actions/update-resource-description.action';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastResult, action] = useActionState(
    projectUpdateDescriptionAction,
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

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />

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
