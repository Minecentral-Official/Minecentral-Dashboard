'use client';

import { useActionState, useEffect, useState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { generateReactHelpers } from '@uploadthing/react';
import { InfoIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import FileUploadButton from '@/components/ui/custom/file-upload-button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import serverDeleteBannerAction from '@/features/serverlist/actions/delete-server-banner.action';
import serverUpdateGeneralAction from '@/features/serverlist/actions/update-server-general.action';
import { ServerImage } from '@/features/serverlist/components/ui/server-image';
import { S_ServerUpdateGeneral } from '@/features/serverlist/schemas/zod/s-server-update-general.zod';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { T_ServerListFileRouter } from '@/features/serverlist/uploadthing/file-routes.serverlist';

export default function ServerUpdateGeneralForm({
  id: serverId,
  iconUrl: oldBannerUrl,
  slug,
  title,
}: Pick<T_DTOServer, 'id' | 'iconUrl' | 'slug' | 'title'>) {
  const [actionState, action] = useActionState(
    serverUpdateGeneralAction,
    undefined,
  );

  const { uploadFiles, useUploadThing } =
    generateReactHelpers<T_ServerListFileRouter>();
  const { isUploading } = useUploadThing('serverlist_banner');
  const [deleteBanner, setDeleteBanner] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(oldBannerUrl);
  const [bannerFile, setBannerFile] = useState<File>();

  const handleSaveBanner = async () => {
    //Upload icon if different
    if (deleteBanner) {
      const result = await serverDeleteBannerAction(serverId);
      if (!result.success) {
        toast.error(result.message, {
          id: 'update-realm',
        });
      } else {
        toast.success(result.message, {
          id: 'update-realm',
        });
      }
    } else if (bannerUrl !== oldBannerUrl && bannerFile) {
      try {
        const uploadData = await uploadFiles('serverlist_banner', {
          files: [bannerFile],
          input: { id: serverId },
        });
        setBannerFile(undefined);
        if (uploadData.length > 0)
          toast.success('Banner upload successful!', {
            id: 'update-realm',
          });
      } catch {
        toast.error('Error while uploading! Max file size 256KB', {
          id: 'update-realm',
        });
      }
    }
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
    setBannerFile(file);
    setBannerUrl(url);
    setDeleteBanner(false);
  };

  const defaultValue = {
    id: serverId,
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
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={serverId} />
      <input
        type='hidden'
        name={fields.deletingIcon.name}
        value={deleteBanner ? 'true' : 'false'}
      />

      <Field>
        <Label className='flex flex-row items-center gap-2'>
          Banner <BannerTooltip />
        </Label>
        <div className='flex flex-col items-center gap-2'>
          <ServerImage title={title} url={bannerUrl} />
          <div className='flex flex-col gap-2 sm:flex-row'>
            <div className='flex flex-row gap-2'>
              <FileUploadButton
                selected={bannerFile !== undefined}
                onFileSelect={handleImageChange}
              />
              <Button
                variant='destructive'
                disabled={
                  (bannerUrl !== oldBannerUrl && deleteBanner) ||
                  (bannerUrl === null && !deleteBanner)
                }
                onClick={(e) => {
                  setDeleteBanner(true);
                  setBannerUrl(null);
                  e.preventDefault();
                }}
              >
                <TrashIcon className='mr-1 h-4 w-4' /> Remove Banner
              </Button>
            </div>
            <Button
              variant='outline'
              disabled={!(bannerUrl !== oldBannerUrl || isUploading)}
              onClick={(e) => {
                e.preventDefault();
                handleSaveBanner();
              }}
            >
              <SaveIcon className='mr-1 h-4 w-4' /> Save Banner
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
          bannerUrl === oldBannerUrl
        }
      >
        Save Changes
      </Button>
    </form>
  );
}

function BannerTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className='h-4 w-4 text-primary hover:cursor-help' />
        </TooltipTrigger>
        <TooltipContent>
          <p>Recommended Icon size is 468x60</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
