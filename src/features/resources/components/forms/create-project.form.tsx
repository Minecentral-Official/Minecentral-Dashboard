'use client';

import { useActionState, useEffect } from 'react';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { InputConform } from '@/components/conform/input.conform';
import { SelectConform } from '@/components/conform/select.conform';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import resourceCreateAction from '@/features/resources/actions/create-resource.action';
import { projectCreateZod } from '@/features/resources/schemas/zod/project-create.zod';
import { CategoriesProjects } from '@/lib/types/project.type';

const typeSelectData = CategoriesProjects.map((category) => ({
  value: category,
  name: category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

export default function ProjectCreateForm() {
  const [actionState, action] = useActionState(resourceCreateAction, undefined);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: projectCreateZod,
      });
      if (submission.status !== 'success') {
        toast.error('Form data invalid', { id: 'create-resource' });
      } else {
        toast.loading('Creating project...', { id: 'create-resource' });
        //Clear Editor Cache
        // window?.localStorage.removeItem('editorContent');
      }
      return submission;
    },
    onSubmit(event, {}) {},
  });

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

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <Field>
        <Label htmlFor={fields.title.id}>Project Name</Label>
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
        <Label htmlFor={fields.type.id}>Resource Type</Label>
        <SelectConform
          placeholder='Select a type...'
          meta={fields.type}
          items={typeSelectData}
        />
        {fields.type.errors && <FieldError>{fields.type.errors}</FieldError>}
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

      <Button>Create Project</Button>
    </form>
  );
}
