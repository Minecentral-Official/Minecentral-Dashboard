'use client';

import { useState } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { HashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { MarkdownProvider } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Button } from '@/components/ui/button';
import FileUploadButton from '@/components/ui/custom/file-upload-button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';
import { C_PluginLoaders } from '@/features/resources/config/c-loaders.plugin';
import { S_ProjectCreateVersion_Plugin } from '@/features/resources/schemas/zod/s-project-create-version.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { useResourceUpload } from '@/features/resources/uploadthing/resource-upload-hook';
import { analyzeMinecraftFile } from '@/features/resources/util/analyze-file';

const supportVersions = C_GameVersions.map((type) => ({
  value: type,
  label: type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

const loaders = C_PluginLoaders.map((plat) => ({
  value: plat,
  label: plat
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

export default function ResourceCreateVersionForm({
  id: resourceId,
  slug,
}: Pick<T_DTOResource, 'id' | 'slug'>) {
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState<boolean>(false);
  const route = useRouter();
  const { uploadFile, isUploading } = useResourceUpload({
    //Message when upload fails
    onUploadError: () => {
      toast.error('Error while uploading file!', { id: 'update-resource' });
    },
    //Message when upload is successful
    onUploadComplete: () => {
      toast.success('New resource version uploaded!', {
        id: 'update-resource',
      });
      route.push(`/dashboard/resources/${slug}/versions`);
    },
    router: 'fileRouterResource',
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectCreateVersion_Plugin,
      });
      return submission;
    },
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!file) {
      toast.error('Please choose a resource file!', { id: 'update-resource' });
      setFileError(true);
      e.preventDefault();
      return;
    }
    setFileError(false);
    return form.onSubmit(e);
  };

  const versionSupportHandle = useInputControl(fields.compatibleVersions);
  const versionTitleHandle = useInputControl(fields.title);
  const versionNumberHandle = useInputControl(fields.version);
  const descriptionHandler = useInputControl(fields.description);
  const versionLoaderHandler = useInputControl(fields.loaders);

  const handleFileChange = async (url: string, file: File) => {
    if (file) {
      setFile(file);
      const data = await analyzeMinecraftFile(file);
      if (data.success) {
        if (data.fileInfo?.fileName)
          versionTitleHandle.change(data.fileInfo.fileName);
        if (data.fileInfo?.version)
          versionNumberHandle.change(data.fileInfo.version);
      }
    } else {
      setFile(undefined);
    }
  };

  function handleSubmit(formData: FormData) {
    toast.loading('Uploading new resource version...', {
      id: 'update-resource',
    });
    const submission = parseWithZod(formData, {
      schema: S_ProjectCreateVersion_Plugin,
    });
    if (submission.status === 'success') uploadFile(file!, submission.value);
  }

  return (
    <form
      id={form.id}
      onSubmit={formSubmit}
      className='flex w-full flex-col gap-6'
      noValidate
      action={handleSubmit}
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />

      <Field>
        <Label>Release File</Label>
        <FileUploadButton
          accept='.jar,.zip'
          onFileSelect={handleFileChange}
          selected={file !== undefined}
        />
        {fileError && <FieldError>Please choose a file to upload!</FieldError>}
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
        <Label htmlFor={fields.compatibleVersions.id} className='flex gap-2'>
          Supported Versions
        </Label>
        <div className='flex flex-row gap-4'>
          <MultiSelect
            options={supportVersions}
            onValueChange={(e) => versionSupportHandle.change(e)}
            variant={'inverted'}
            maxCount={16}
          />
        </div>
        {fields.compatibleVersions.errors && (
          <FieldError>{fields.compatibleVersions.errors}</FieldError>
        )}
      </Field>

      <Field>
        <Label
          htmlFor={fields.loaders.id}
          className='flex gap-2 text-sm font-thin'
        >
          Loaders
        </Label>
        <div className='flex flex-row gap-4'>
          <MultiSelect
            options={loaders}
            onValueChange={(e) => versionLoaderHandler.change(e)}
            variant={'inverted'}
            maxCount={16}
          />
        </div>

        {fields.compatibleVersions.errors && (
          <FieldError>{fields.loaders.errors}</FieldError>
        )}
      </Field>

      <Button
        disabled={
          JSON.stringify(form.value) === JSON.stringify(form.initialValue) ||
          isUploading
        }
      >
        Save Changes
      </Button>
    </form>
  );
}
