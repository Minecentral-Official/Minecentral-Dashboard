import { ComponentProps, useRef } from 'react';

import { unstable_useControl as useControl } from '@conform-to/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { FieldMetadata } from '@conform-to/react';
import type { ElementRef } from 'react';

export const SelectConform = ({
  meta,
  items,
  placeholder,
  onValueChange,
  ...props
}: {
  meta: FieldMetadata<string>;
  items: Array<{ name: string; value: string }>;
  placeholder: string;
} & ComponentProps<typeof Select>) => {
  const selectRef = useRef<ElementRef<typeof SelectTrigger>>(null);
  const control = useControl(meta);

  function handleValueChange(value: string) {
    control.change(value);
    if (onValueChange) {
      onValueChange(value);
    }
  }

  return (
    <>
      <select
        name={meta.name}
        defaultValue={meta.initialValue ?? ''}
        className='sr-only'
        ref={control.register}
        aria-hidden
        tabIndex={-1}
        onFocus={() => {
          selectRef.current?.focus();
        }}
      >
        <option value='' />
        {items.map((option) => (
          <option key={option.value} value={option.value} />
        ))}
      </select>

      <Select
        {...props}
        value={control.value ?? ''}
        onValueChange={handleValueChange}
        onOpenChange={(open) => {
          if (!open) {
            control.blur();
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
