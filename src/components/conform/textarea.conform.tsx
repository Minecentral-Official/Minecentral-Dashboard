import { ComponentProps } from 'react';

import { FieldMetadata, getTextareaProps } from '@conform-to/react';

import { Textarea } from '@/components/ui/textarea';

export const TextareaConform = ({
  meta,
  key,
  ...props
}: {
  meta: FieldMetadata<string>;
} & ComponentProps<typeof Textarea>) => {
  const { key: textareaPropsKey, ...textareaProps } = getTextareaProps(meta);
  return (
    <Textarea key={key ?? textareaPropsKey} {...textareaProps} {...props} />
  );
};
