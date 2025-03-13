'use client';

import { useActionState, useEffect } from 'react';

import { useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Field, FieldError } from '@/components/conform/field.conform';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import projectUpdateTagsAction_Plugin from '@/features/resources/actions/update-resource-tags-plugin.action';
import { C_PluginCategories } from '@/features/resources/config/plugin-categories.config';
import { S_ProjectUpdateTags_Plugin } from '@/features/resources/schemas/zod/s-project-update-tags-plugin.zod';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { pluginGetCategoryIcon } from '@/features/resources/util/plugin-category-icon.get';
import { pluginGetCategoryText } from '@/features/resources/util/plugin-category-text.get';

const categoriesList = C_PluginCategories.map((cat) => ({
  Icon: pluginGetCategoryIcon(cat),
  value: cat,
  label: pluginGetCategoryText(cat),
}));

export default function ResourceUpdateTagsForm_Plugin({
  id: resourceId,
  categories,
}: Pick<T_DTOResource, 'id' | 'categories'>) {
  const [actionState, action] = useActionState(
    projectUpdateTagsAction_Plugin,
    undefined,
  );

  const defaultValue = {
    categories,
    id: resourceId,
  };

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const submission = parseWithZod(formData, {
        schema: S_ProjectUpdateTags_Plugin,
      });
      if (submission.status !== 'success') {
        console.log(submission.error);
        toast.error('Form data invalid', { id: 'update-resource' });
      } else {
        toast.loading('Updating project...', { id: 'update-resource' });
      }
      return submission;
    },
    defaultValue,
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

  const categoriesHandle = useInputControl(fields.categories);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className='flex w-full flex-col gap-6'
      action={action}
      noValidate
    >
      <input type='hidden' name={fields.id.name} value={resourceId} />

      <Field>
        <Label htmlFor={fields.categories.id} className='flex gap-2'>
          Categories
        </Label>
        <div className='flex flex-row gap-4'>
          <div className='grid w-full grid-cols-1 justify-between gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {categoriesList.map(({ Icon, value, label }) => {
              return (
                <div
                  key={value}
                  className='flex flex-row items-center space-x-2'
                >
                  <Checkbox
                    checked={fields.categories.value?.includes(value)}
                    onChange={(e) =>
                      categoriesHandle.change(e.currentTarget.value)
                    }
                  />
                  <label className='flex flex-row items-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    <Icon className='mr-1 h-4 w-4' /> {label}
                  </label>
                </div>
              );
            })}
          </div>

          {/* <MultiSelect
            options={categoriesList}
            onValueChange={(e) => categoriesHandle.change(e)}
            variant={'inverted'}
            maxCount={16}
          /> */}
        </div>
        {fields.categories.errors && (
          <FieldError>{fields.categories.errors}</FieldError>
        )}
      </Field>

      <Button
      // disabled={
      //   JSON.stringify(form.value) === JSON.stringify(form.initialValue)
      // }
      >
        Save Changes
      </Button>
    </form>
  );
}
