'use client';

import { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCheckbox } from '@/features/resource-plugin/components/ui/custom-checkbox';
import { pluginCategoriesConfig } from '@/features/resource-plugin/config/categories.plugin';

export default function CategoriesFilter() {
  const [open, setOpen] = useState(true);
  return (
    <Card>
      <CardHeader
        className='mb-2 ml-2 flex flex-row items-center justify-between px-4 py-4 hover:cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <CardTitle>Categories</CardTitle>
        {open ?
          <ChevronDownIcon className='h-4 w-4' />
        : <ChevronUpIcon className='h-4 w-4' />}
      </CardHeader>
      <CardContent className='w-full space-y-1 px-4'>
        {pluginCategoriesConfig.map((item) => (
          <CustomCheckbox
            key={item}
            label={item.charAt(0).toUpperCase() + item.slice(1)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
