import { useRef } from 'react';

import { unstable_useControl as useControl } from '@conform-to/react';

import { Switch } from '@/components/ui/switch';

import type { FieldMetadata } from '@conform-to/react';
import type { ElementRef } from 'react';

export function SwitchConform({ meta }: { meta: FieldMetadata<boolean> }) {
  const switchRef = useRef<ElementRef<typeof Switch>>(null);
  const control = useControl(meta);

  return (
    <>
      <input
        name={meta.name}
        ref={control.register}
        defaultValue={meta.initialValue}
        className='sr-only'
        tabIndex={-1}
        onFocus={() => {
          switchRef.current?.focus();
        }}
      />
      <Switch
        ref={switchRef}
        checked={control.value === 'on'}
        onCheckedChange={(checked) => {
          control.change(checked ? 'on' : '');
        }}
        onBlur={control.blur}
        className='focus:ring-2 focus:ring-stone-950 focus:ring-offset-2'
      ></Switch>
    </>
  );
}
