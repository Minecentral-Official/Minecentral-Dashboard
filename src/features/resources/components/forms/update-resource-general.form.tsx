'use client';

import { useActionState, useEffect, useState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { generateReactHelpers } from '@uploadthing/react';
import { LoaderPinwheelIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import FileUploadButton from '@/components/ui/custom/file-upload-button';
import { Label } from '@/components/ui/label';
import resourceDeleteIconAction from '@/features/resources/actions/delete-resource-icon.action';
import projectUpdateGeneralAction from '@/features/resources/actions/update-resource-general.action';
import { ResourceImage } from '@/features/resources/components/ui/resource-image';
import { S_ProjectUpdateGeneral } from '@/features/resources/schemas/zod/s-project-update-general.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { T_ResourceFileRouter } from '@/features/resources/uploadthing/file-routes.resource';
import { getResourceUrl } from '@/features/resources/util/get-resource-url';

export default function ResourceUpdateGeneralForm({
  id: resourceId,
  iconUrl: oldIconUrl,
  slug,
  subtitle,
  title,
  type,
}: Pick<
  T_DTOResource,
  'id' | 'iconUrl' | 'slug' | 'title' | 'subtitle' | 'type'
>) {
  const [actionState, action] = useActionState(
    projectUpdateGeneralAction,
    undefined,
  );

  const { useUploadThing } = generateReactHelpers<T_ResourceFileRouter>();
  const [deleteIcon, setDeleteIcon] = useState(false);
  const [iconUrl, setIconUrl] = useState(oldIconUrl);
  const [iconFile, setIconFile] = useState<File>();

  const { startUpload, isUploading } = useUploadThing('resource_icon', {
    onUploadError: () => {
      toast.error('Error while uploading! Max file size is 256KB', {
        id: 'update-resource',
      });
    },
    //Message when upload is successful
    onClientUploadComplete: () => {
      toast.success('Resource icon updated!', {
        id: 'update-resource',
      });
    },
  });

  const handleUploadIcon = async () => {
    //Upload icon if different
    if (deleteIcon) {
      const result = await resourceDeleteIconAction(resourceId);
      if (!result.success) {
        toast.error(result.message, {
          id: 'update-resource',
        });
      } else {
        toast.success(result.message, {
          id: 'update-resource',
        });
      }
    } else if (iconUrl !== oldIconUrl && iconFile) {
      const uploadData = await startUpload([iconFile], { id: resourceId });
      setIconFile(undefined);
      if (uploadData && uploadData.length > 0) {
        toast.success('Icon upload successful!', {
          id: 'update-resource',
        });
      } else {
        toast.error('Error while uploading!', {
          id: 'update-resource',
        });
      }
    }
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

  const handleImageChange = (url: string, file: File) => {
    setIconFile(file);
    setIconUrl(url);
    setDeleteIcon(false);
  };

  const defaultValue = {
    id: resourceId,
    slug,
    subtitle,
    title,
    deletingIcon: false,
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
        console.log(submission.error);
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
      <input
        type='hidden'
        name={fields.deletingIcon.name}
        value={deleteIcon ? 'true' : 'false'}
      />

      <Field>
        <Label>Icon</Label>
        <div className='flex flex-row items-center gap-2'>
          <ResourceImage title={title} url={iconUrl} />
          <div className='flex flex-col gap-2'>
            <FileUploadButton onFileSelect={handleImageChange} />
            <Button
              variant='destructive'
              disabled={
                (iconUrl !== oldIconUrl && deleteIcon) ||
                (iconUrl === null && !deleteIcon)
              }
              onClick={(e) => {
                setDeleteIcon(true);
                setIconUrl(null);
                e.preventDefault();
              }}
            >
              <TrashIcon className='mr-1 h-4 w-4' /> Delete Icon
            </Button>
            <Button
              variant='outline'
              disabled={iconUrl === oldIconUrl || isUploading}
              onClick={(e) => {
                e.preventDefault();
                handleUploadIcon();
              }}
            >
              {!isUploading ?
                <>
                  <SaveIcon className='mr-1 h-4 w-4' />
                  Save Icon
                </>
              : <>
                  <LoaderPinwheelIcon className='mr-1 h-4 w-4 animate-spin' />
                  Saving
                </>
              }
            </Button>
          </div>
          {/* <Input
            type='file'
            onChange={(event) => handleImageChange(event.target.files)}
          /> */}
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
          <span className='text-accent-foreground/75'>{`https://minecentral.net/${getResourceUrl(type)}/`}</span>
          {fields.slug.value}
        </p>
      </Field>

      <Field>
        <Label htmlFor={fields.subtitle.id}>Summary</Label>
        <p className='text-sm text-accent-foreground/75'>
          Short sentence describing your project.
        </p>
        <InputConform meta={fields.subtitle} type='text' />

        {fields.subtitle.errors && (
          <FieldError>{fields.subtitle.errors}</FieldError>
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
