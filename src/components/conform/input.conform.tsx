import { ComponentProps } from 'react';

import { FieldMetadata, getInputProps } from '@conform-to/react';

import { Input } from '@/components/ui/input';

export const InputConform = ({
  meta,
  type,
  key,
  ...props
}: {
  meta: FieldMetadata<string | null | undefined>;
  type: Parameters<typeof getInputProps>[1]['type'];
} & ComponentProps<typeof Input>) => {
  const { key: inputPropsKey, ...inputProps } = getInputProps(meta, {
    type,
    ariaAttributes: true,
  });
  return <Input key={key ?? inputPropsKey} {...inputProps} {...props} />;
};
