'use client';

import { useActionState, useEffect, useState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import FileUploadButton from '@/components/ui/custom/file-upload-button';
import { Label } from '@/components/ui/label';
import projectUpdateGeneralAction from '@/features/resources/actions/update-resource-general.action';
import { useUploadResource } from '@/features/resources/uploadthing/resource-upload-hook.resource';
import { ServerImage } from '@/features/serverlist/components/ui/server-image';
import { S_ServerUpdateGeneral } from '@/features/serverlist/schemas/zod/s-server-update-general.zod';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';

export default function ServerUpdateGeneralForm({
  id: resourceId,
  iconUrl: oldIconUrl,
  slug,
  title,
}: Pick<T_DTOServer, 'id' | 'iconUrl' | 'slug' | 'title'>) {
  const [actionState, action] = useActionState(
    projectUpdateGeneralAction,
    undefined,
  );

  const { uploadFile } = useUploadResource({ router: 'fileRouterIcon' });
  const [deleteIcon, setDeleteIcon] = useState(false);
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
        id: 'update-realm',
      });
    } else if (actionState?.success === false) {
      toast.error(actionState?.message, { id: 'update-realm' });
    }
  }, [actionState]);

  const handleImageChange = (url: string, file: File) => {
    setIconFile(file);
    setIconUrl(url);
    setDeleteIcon(false);
  };

  const defaultValue = {
    id: resourceId,
    slug,
    title,
    deletingIcon: false,
  };

  const [form, fields] = useForm({
    lastResult: undefined,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ServerUpdateGeneral,
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

  return (
    <form
      id={form.id}
      onSubmit={handleSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />
      <input
        type='hidden'
        name={fields.deletingIcon.name}
        value={deleteIcon ? 'true' : 'false'}
      />

      <Field>
        <Label>Banner</Label>
        <div className='flex flex-col items-center gap-2'>
          <ServerImage url={iconUrl} />
          <div className='flex flex-row gap-2'>
            <FileUploadButton onFileSelect={handleImageChange} />
            <Button
              disabled={deleteIcon}
              onClick={(e) => {
                setDeleteIcon(true);
                setIconUrl(null);
                e.preventDefault();
              }}
            >
              <TrashIcon className='mr-1 h-4 w-4' /> Delete Banner
            </Button>
          </div>
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
        <p className='text-sm text-accent-foreground'>
          <span className='text-accent-foreground/75'>{`https://minecentral.net/serverlist/`}</span>
          {fields.slug.value}
        </p>
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
