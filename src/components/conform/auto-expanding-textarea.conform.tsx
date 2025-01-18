'use client';

import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';

import { unstable_useControl as useControl } from '@conform-to/react';

import { Textarea } from '@/components/ui/textarea';

import type { FieldMetadata } from '@conform-to/react';
import type { ComponentProps } from 'react';

type AutoExpandingTextareaProps = {
  //   placeholder?: string
  //   className?: string
  //   value: string
  //   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  //   onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void,

  // conform
  meta: FieldMetadata<string>;
} & ComponentProps<typeof Textarea>;

export default function AutoExpandingTextareaConform({
  meta,
  placeholder,
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { value, change, register, blur } = useControl(meta);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (value === undefined) {
      change('');
    }

    adjustHeight();
  }, [value, change]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    change(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent default Enter key behavior
    if (e.key === 'Enter') {
      e.preventDefault();

      // Add a new line only when Shift + Enter is pressed
      if (e.shiftKey) {
        const newValue =
          value!.slice(0, e.currentTarget.selectionStart) +
          '\n' +
          value!.slice(e.currentTarget.selectionEnd);
        change(newValue);
      }
    }
  };

  return (
    <>
      <textarea
        ref={register}
        name={meta.name}
        defaultValue={meta.initialValue}
        tabIndex={-1}
        className='sr-only'
        onFocus={() => {
          textareaRef.current?.focus();
        }}
      />
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={blur}
        className='min-h-[38px]'
        style={{
          resize: 'none',
          overflow: 'hidden',
          lineHeight: '1.5',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        }}
        placeholder={placeholder}
        rows={1}
      />
    </>
  );
}
