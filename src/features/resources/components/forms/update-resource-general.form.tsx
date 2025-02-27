'use client';

import { useActionState, useState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Image from 'next/image';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectUpdateGeneralZod } from '@/features/resources/schemas/zod/update-general.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { useResourceUpload } from '@/features/resources/uploadthing/resource-upload-hook';
import { getChangedFields } from '@/lib/utils/get-changed-fields';
import projectUpdateAction from '../../actions/update-resource.action';

export default function ResourceUpdateGeneralForm({
  id: resourceId,
  iconUrl: oldIconUrl,
  slug,
  subtitle,
  title,
}: Pick<T_DTOResource, 'id' | 'iconUrl' | 'slug' | 'title' | 'subtitle'>) {
  const [lastResult, action] = useActionState(projectUpdateAction, undefined);

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
    lastResult,
    onValidate({ formData }) {
      const changedData = getChangedFields(
        defaultValue,
        Object.fromEntries(formData.entries()) as typeof defaultValue,
      );
      const formDataObject = new FormData();
      formDataObject.append('id', resourceId);
      Object.entries(changedData).forEach(([key, value]) => {
        formDataObject.append(key, String(value)); // Convert value to string if necessary
      });

      const submission = parseWithZod(formDataObject, {
        schema: projectUpdateGeneralZod,
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

  console.log(oldIconUrl, iconUrl, iconUrl === oldIconUrl);

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
