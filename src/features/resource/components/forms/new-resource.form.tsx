'use client';

import { useActionState } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { CheckboxGroupConform } from '@/components/conform/checkbox-group.conform';
import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import resourceCreate from '@/features/resource/mutations/create.resource';
import { resourceCreateZod } from '@/features/resource/schemas/zod/resource.zod';
import { TMinecraftVersion } from '@/features/resource/types/minecraft-versions.type';

export default function CreateResourceForm() {
  const [lastResult, action] = useActionState(resourceCreate, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: resourceCreateZod,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid', { id: 'create-resource' });
      } else {
        toast.loading('Posting Resource...', { id: 'create-resource' });
      }
      return submission;
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    defaultValue: {
      title: '',
      description: '',
    },
  });

  const versionsData = TMinecraftVersion.map((type) => ({
    value: type,
    name: type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));

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
          <Label htmlFor={fields.versionSupport.id}>Version Support</Label>
          <div className='flex flex-row gap-4'>
            <CheckboxGroupConform
              items={versionsData}
              meta={fields.versionSupport}
            />
          </div>
          {fields.versionSupport.errors && (
            <FieldError>{fields.versionSupport.errors}</FieldError>
          )}
        </Field>
        {/* <Field>
          <Label htmlFor={fields.categories.id}>Categories</Label>
          <SelectConform
            placeholder='Select a category'
            meta={fields.versionSupport}
            items={categorySelectData}
          />

          {fields.category.errors && (
            <FieldError>{fields.category.errors}</FieldError>
          )}
        </Field> */}
        <Field>
          <Label htmlFor={fields.subtitle.id}>SubTitle</Label>
          <InputConform meta={fields.subtitle} type='text' />
          {fields.subtitle.errors && (
            <FieldError>{fields.subtitle.errors}</FieldError>
          )}
        </Field>
        <Button>Post Resource</Button>
      </form>
    </div>
  );
}
