'use client';

import { useActionState } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { MarkdownProviver } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import resourceUpdateGeneralAction from '@/features/resources/actions/update-resource-general.action';
import { resourceUpdateDescriptionZod } from '@/features/resources/schemas/zod/update-description.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceUpdateDescriptionForm({
  description,
  id: resourceId,
}: Pick<T_DTOResource, 'id' | 'description'>) {
  const [lastResult, action] = useActionState(
    resourceUpdateGeneralAction,
    undefined,
  );

  const defaultValue = {
    description,
    resourceId,
  };

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: resourceUpdateDescriptionZod,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Form data invalid', { id: 'update-resource' });
      } else {
        toast.loading('Updating project...', { id: 'update-resource' });
        //Clear Editor Cache
        // window?.localStorage.removeItem('editorContent');
      }
      return submission;
    },
    defaultValue,
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
      <input type='hidden' name={fields.resourceId.name} value={resourceId} />

      <Field>
        <Label htmlFor={fields.description.id}>Description</Label>
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
