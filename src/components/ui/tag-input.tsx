'use client';

import * as React from 'react';

import { X } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  initialTags = [],
  onChange,
  placeholder = 'Add a tag...',
}: TagInputProps) {
  const [tags, setTags] = React.useState<string[]>(initialTags);
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange?.(newTags);
      setInputValue('');
    } else if (tags.includes(trimmedTag)) {
      toast.info(`You cannot add the same tag more than once`);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Badge
            key={tag}
            className='pl-1 hover:cursor-pointer'
            onClick={() => removeTag(tag)}
          >
            <X className='mr-1 h-4 w-4 hover:text-red-500' />
            <span className='sr-only'>Remove tag</span>
            {tag}
          </Badge>
        ))}
      </div>
      <Input
        type='text'
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
    </div>
  );
}
