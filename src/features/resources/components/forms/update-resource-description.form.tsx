'use client';

import { useActionState } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { MarkdownProviver } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Button } from '@/components/ui/button';
import projectUpdateAction from '@/features/resources/actions/update-resource.action';
import { projectUpdateDescriptionZod } from '@/features/resources/schemas/zod/update-description.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceUpdateDescriptionForm({
  description,
  id: resourceId,
}: Pick<T_DTOResource, 'id' | 'description'>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastResult, action] = useActionState(projectUpdateAction, undefined);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: projectUpdateDescriptionZod,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Form data invalid', { id: 'update-resource' });
      } else {
        toast.loading('Updating project...', { id: 'update-resource' });
      }
      return submission;
    },
    defaultValue: {
      description,
      id: resourceId,
    },
  });

  const contentDescriptionHandler = useInputControl(fields.description);

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
        <div className='container w-full px-0 py-4'>
          <MarkdownProviver initialMarkdown={fields.description.value || ''}>
            <MarkdownEditor onChange={contentDescriptionHandler.change} />
          </MarkdownProviver>
        </div>

        {fields.description.errors && (
          <FieldError>{fields.description.errors}</FieldError>
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
