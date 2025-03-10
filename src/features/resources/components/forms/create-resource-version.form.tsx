'use client';

import { useState } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { HashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { MarkdownProvider } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';
import { S_ProjectUploadVersion } from '@/features/resources/schemas/zod/s-project-upload-version.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

const supportVersions = C_ResourceVersionSupport.map((type) => ({
  value: type,
  label: type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

export default function ResourceCreateVersion({
  id: resourceId,
}: Pick<T_DTOResource, 'id'>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [file, setFile] = useState<File>();
  // const { uploadFile } = useResourceUpload({ router: 'resourceUpload' });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectUploadVersion,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Form data invalid', { id: 'update-resource' });
      } else {
        toast.loading('Updating project...', { id: 'update-resource' });
      }
      return submission;
    },
  });

  // // Show toast when state changes
  // useEffect(() => {
  //   if (uploadResponse?.data) {
  //     toast.success(actionState.message, {
  //       id: 'create-release',
  //     });
  //   } else if (actionState?.success === false) {
  //     toast.error(actionState?.message, { id: 'update-resource' });
  //   }
  // }, [uploadResponse]);

  const versionSupportHandle = useInputControl(fields.compataibleVersions);
  const descriptionHandler = useInputControl(fields.description);

  const handleFileChange = (file: FileList | null) => {
    if (file && file[0]) {
      setFile(file[0]);
    } else {
      setFile(undefined);
    }
  };

  function handleSubmit() {
    toast.warning('Something happened', { id: 'update-resource' });
  }

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      noValidate
      action={handleSubmit}
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />

      <Field>
        <Label>Release File</Label>
        <Input
          type='file'
          onChange={(event) => handleFileChange(event.target.files)}
        />
      </Field>

      <Field>
        <Label htmlFor={fields.title.id} className='flex gap-2'>
          Version Title
        </Label>
        <InputConform meta={fields.title} type='text' />
        {fields.title.errors && <FieldError>{fields.title.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.description.id} className='flex gap-2'>
          Change Log
        </Label>
        <MarkdownProvider>
          <MarkdownEditor onChange={descriptionHandler.change} />
        </MarkdownProvider>
        {fields.description.errors && (
          <FieldError>{fields.description.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.version.id} className='flex gap-2'>
          Version Number
        </Label>
        <p className='text-sm font-light'>
          Next nominal version number for this release
        </p>
        <div className='relative'>
          <HashIcon className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <InputConform meta={fields.version} type='text' className='pl-8' />
        </div>
        {fields.version.errors && (
          <FieldError>{fields.version.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label htmlFor={fields.compataibleVersions.id} className='flex gap-2'>
          Supported Versions
        </Label>
        <div className='flex flex-row gap-4'>
          <MultiSelect
            options={supportVersions}
            onValueChange={(e) => versionSupportHandle.change(e)}
            variant={'inverted'}
          />
        </div>
        {fields.compataibleVersions.errors && (
          <FieldError>{fields.compataibleVersions.errors}</FieldError>
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
