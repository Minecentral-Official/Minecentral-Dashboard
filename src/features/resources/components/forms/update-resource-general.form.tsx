'use client';

import { useActionState, useEffect, useState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Image from 'next/image';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import projectUpdateGeneralAction from '@/features/resources/actions/update-resource-general.action';
import { S_ProjectUpdateGeneral } from '@/features/resources/schemas/zod/s-project-update-general.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { useResourceUpload } from '@/features/resources/uploadthing/resource-upload-hook';

export default function ResourceUpdateGeneralForm({
  id: resourceId,
  iconUrl: oldIconUrl,
  slug,
  subtitle,
  title,
}: Pick<T_DTOResource, 'id' | 'iconUrl' | 'slug' | 'title' | 'subtitle'>) {
  const [actionState, action] = useActionState(
    projectUpdateGeneralAction,
    undefined,
  );

  const { uploadFile } = useResourceUpload({ router: 'iconUploader' });
  const [iconUrl, setIconUrl] = useState(oldIconUrl);
  const [iconFile, setIconFile] = useState<File>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //Upload icon if different
    if (iconUrl !== oldIconUrl && iconFile) {
      await uploadFile(iconFile, { id: resourceId });
    }
    //Submit form, but cancel if no changes applied
    form.onSubmit(e);
  };

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

  const handleImageChange = (file: FileList | null) => {
    if (file && file[0]) {
      setIconFile(file[0]);
      setIconUrl(URL.createObjectURL(file[0]));
    } else {
      setIconUrl(oldIconUrl);
    }
  };

  const defaultValue = {
    id: resourceId,
    slug,
    subtitle,
    title,
  };

  const [form, fields] = useForm({
    lastResult: undefined,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectUpdateGeneral,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid, please fix any errors', {
          id: 'update-resource',
        });
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
      onSubmit={handleSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />

      <Field>
        <Label>Icon</Label>
        <div className='flex flex-row gap-2'>
          <Image
            width={100}
            height={100}
            alt='Resource Icon'
            src={iconUrl || '/placeholder.png'}
            className='h-[100px] w-[100px] object-cover'
          />
          <Input
            type='file'
            onChange={(event) => handleImageChange(event.target.files)}
          />
        </div>
      </Field>

      <Field>
        <Label htmlFor={fields.title.id}>Title</Label>
        <InputConform meta={fields.title} type='text' />
        {fields.title.errors && <FieldError>{fields.title.errors}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor={fields.slug.id}>URL Slug</Label>
        <InputConform meta={fields.slug} type='text' />
        {fields.slug.errors && <FieldError>{fields.slug.errors}</FieldError>}
        <p className=''>
          <span className='text-accent-foreground'>{`https://minecentral.net/resource/`}</span>
          {fields.slug.value}
        </p>
      </Field>

      <Field>
        <Label htmlFor={fields.subtitle.id}>Summary</Label>
        <p className='text-accent-foreground'>
          Short sentence describing your project.
        </p>
        <InputConform meta={fields.subtitle} type='text' />

        {fields.subtitle.errors && (
          <FieldError>{fields.subtitle.errors}</FieldError>
        )}
      </Field>

      <Button
        disabled={
          JSON.stringify(form.value) === JSON.stringify(form.initialValue) &&
          iconUrl === oldIconUrl
        }
      >
        Save Changes
      </Button>
    </form>
  );
}
