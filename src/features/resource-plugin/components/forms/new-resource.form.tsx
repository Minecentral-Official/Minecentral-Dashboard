'use client';

import { useActionState } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { MarkdownProviver } from '@/components/markdown-editor/context/markdown.context';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { Input } from '@/components/plate-ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { TagInput } from '@/components/ui/tag-input';
import { Toaster } from '@/components/ui/toaster';
import resourceCreateAction from '@/features/resource-plugin/actions/create-resource.action';
import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import { TPluginVersions } from '@/features/resource-plugin/config/versions.plugin';
import { pluginCreateZod } from '@/features/resource-plugin/schemas/zod/create-plugin.zod';

const mcVersions = TPluginVersions.map((type) => ({
  value: type,
  label: type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

const mcCategories = TPluginCategories.map((type) => ({
  value: type,
  label: type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

const defaultContent = `
# New Resource

### Use markdown to create your description

Learn some Markdown syntax [here](https://www.markdownguide.org/basic-syntax/)`;

export default function ResourceCreateForm() {
  const [lastResult, action] = useActionState(resourceCreateAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: pluginCreateZod,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid', { id: 'create-resource' });
      } else {
        toast.loading('Posting Resource...', { id: 'create-resource' });
        //Clear Editor Cache
        // window?.localStorage.removeItem('editorContent');
      }
      return submission;
    },
    defaultValue: {
      description: JSON.parse(JSON.stringify(defaultContent)),
      resourceType: 'file',
    },
  });
  const contentDescriptionHandler = useInputControl(fields.description);
  const versionSupportHandle = useInputControl(fields.versionSupport);
  const relatedCategoriesHandle = useInputControl(fields.categories);
  const tagsHandle = useInputControl(fields.tags);
  const languagesHandle = useInputControl(fields.languages);
  const resourceTypeHandle = useInputControl(fields.resourceType);

  return (
    <div>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        className='flex flex-col gap-6'
        action={action}
        noValidate
      >
        <Field>
          <Label htmlFor={fields.title.id}>Title</Label>
          <InputConform meta={fields.title} type='text' />
          {fields.title.errors && (
            <FieldError>{fields.title.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.subtitle.id}>SubTitle</Label>
          <InputConform meta={fields.subtitle} type='text' />
          {fields.subtitle.errors && (
            <FieldError>{fields.subtitle.errors}</FieldError>
          )}
        </Field>

        <Separator />

        <Field>
          <Label>Resource Type</Label>
          <RadioGroup
            defaultValue='file'
            onValueChange={(value) => resourceTypeHandle.change(value)}
            className='flex flex-col space-y-1 pt-2'
          >
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-2'>
                <RadioGroupItem value='file' id='resource-file' />
                <Label htmlFor='resource-file'>File Upload</Label>
              </div>
              <Field>
                <Input
                  disabled={fields.resourceType.value !== 'file'}
                  type='file'
                  name={fields.resourceFile.name}
                />
                {fields.resourceFile.errors && (
                  <FieldError>{fields.resourceFile.errors}</FieldError>
                )}
              </Field>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-2'>
                <RadioGroupItem value='url' id='resource-url' />
                <Label htmlFor='resource-url'>Direct URL</Label>
              </div>
              <Field>
                <InputConform
                  disabled={fields.resourceType.value !== 'url'}
                  meta={fields.resourceUrl}
                  type='url'
                  placeholder='https://example.com/file/1234'
                />
                {fields.resourceUrl.errors && (
                  <FieldError>{fields.resourceUrl.errors}</FieldError>
                )}
              </Field>
            </div>
          </RadioGroup>
        </Field>

        <Field>
          <Label htmlFor={fields.releaseVersion.id}>
            Resource String Version
          </Label>
          <InputConform
            meta={fields.releaseVersion}
            type='text'
            placeholder='v1.23.4'
          />
          {fields.releaseVersion.errors && (
            <FieldError>{fields.releaseVersion.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.versionSupport.id}>Version Support</Label>
          <div className='flex flex-row gap-4'>
            <MultiSelect
              options={mcVersions}
              onValueChange={(e) => versionSupportHandle.change(e)}
              variant={'inverted'}
            />
          </div>
          {fields.versionSupport.errors && (
            <FieldError>{fields.versionSupport.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.versionSupport.id}>Related Categories</Label>
          <div className='flex flex-row gap-4'>
            <MultiSelect
              options={mcCategories}
              onValueChange={(e) => relatedCategoriesHandle.change(e)}
              variant={'inverted'}
            />
          </div>
          {fields.versionSupport.errors && (
            <FieldError>{fields.versionSupport.errors}</FieldError>
          )}
        </Field>

        <Separator />

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

        <Field>
          <Label htmlFor={fields.linkSource.id}>Source Code Link</Label>
          <InputConform meta={fields.linkSource} type='text' />
          {fields.linkSource.errors && (
            <FieldError>{fields.linkSource.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.linkSupport.id}>Additional Support Link</Label>
          <InputConform meta={fields.linkSupport} type='text' />
          {fields.linkSupport.errors && (
            <FieldError>{fields.linkSupport.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.languages.id}>Supported Languages</Label>
          <TagInput
            // className='sm:min-w-[450px]'
            onChange={(e) => languagesHandle.change(e)}
            placeholder={'Add a langauge...'}
            // setTags={(newTags) => {
            //   setTags(newTags);
            //   const asdf = newTags as [Tag, ...Tag[]];
            //   const simpleTags = asdf.map(({ text }) => text);
            //   tagsHandle.change(simpleTags);
            // }}
          />
          {fields.languages.errors && (
            <FieldError>{fields.languages.errors}</FieldError>
          )}
        </Field>

        <Field>
          <Label htmlFor={fields.tags.id}>Tags</Label>
          <TagInput
            // className='sm:min-w-[450px]'
            onChange={(e) => tagsHandle.change(e)}
            // setTags={(newTags) => {
            //   setTags(newTags);
            //   const asdf = newTags as [Tag, ...Tag[]];
            //   const simpleTags = asdf.map(({ text }) => text);
            //   tagsHandle.change(simpleTags);
            // }}
          />
          {fields.tags.errors && <FieldError>{fields.tags.errors}</FieldError>}
        </Field>

        <Button>Post Resource</Button>
      </form>
      <Toaster />
    </div>
  );
}
