'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { Input } from '@/components/plate-ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import resourceUploadIconAction from '@/features/resource-plugin/actions/upload-resource-icon.action';
import { pluginUploadIconZod } from '@/features/resource-plugin/schemas/zod/upload-icon.zod';

export default function ResourceUploadIconForm({
  resourceId,
}: {
  resourceId: number;
}) {
  const [lastResult, action] = useActionState(
    resourceUploadIconAction,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: pluginUploadIconZod,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Upload error, please try again', { id: 'icon-upload' });
      } else {
        toast.loading('Uploading Icon...', { id: 'icon-upload' });
      }
      return submission;
    },
    defaultValue: {
      resourceId,
    },
  });

  return (
    <div>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        className='flex flex-col gap-6'
        action={action}
        noValidate
      >
        <input type='hidden' name='resourceId' value={resourceId} />

        <Field>
          <Label htmlFor={fields.image.id}>Upload a new resource icon</Label>
          <Input type='file' name={fields.image.name} />
          {fields.image.errors && (
            <FieldError>{fields.image.errors}</FieldError>
          )}
        </Field>

        <Button>Upload Icon</Button>
      </form>
      <Toaster />
    </div>
  );
}
