'use client';

import { useActionState, useEffect } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { MarkdownProvider } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Button } from '@/components/ui/button';
import projectUpdateDescriptionAction from '@/features/resources/actions/update-resource-description.action';
import { S_ProjectUpdateDescription } from '@/features/resources/schemas/zod/s-project-update-description.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceUpdateDescriptionForm({
  description,
  id: resourceId,
}: Pick<T_DTOResource, 'id' | 'description'>) {
  const [actionState, action] = useActionState(
    projectUpdateDescriptionAction,
    undefined,
  );

  const defaultValue = {
    description,
    id: resourceId,
  };

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectUpdateDescription,
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
          <MarkdownProvider initialMarkdown={fields.description.value || ''}>
            <MarkdownEditor onChange={contentDescriptionHandler.change} />
          </MarkdownProvider>
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
