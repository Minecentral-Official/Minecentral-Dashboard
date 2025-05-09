import { useRef } from 'react';

import { unstable_useControl as useControl } from '@conform-to/react';

import { Checkbox } from '@/components/ui/checkbox';

import type { FieldMetadata } from '@conform-to/react';
import type { ElementRef } from 'react';

export function CheckboxConform({
  meta,
}: {
  meta: FieldMetadata<string | boolean | undefined>;
}) {
  const checkboxRef = useRef<ElementRef<typeof Checkbox>>(null);
  const control = useControl(meta);

  return (
    <>
      <input
        className='sr-only'
        aria-hidden
        ref={control.register}
        name={meta.name}
        tabIndex={-1}
        defaultValue={meta.initialValue}
        onFocus={() => checkboxRef.current?.focus()}
      />
      <Checkbox
        ref={checkboxRef}
        id={meta.id}
        checked={control.value === 'on'}
        onCheckedChange={(checked) => {
          control.change(checked ? 'on' : '');
        }}
        onBlur={control.blur}
        className='focus:ring-2 focus:ring-stone-950 focus:ring-offset-2'
      />
    </>
  );
}
