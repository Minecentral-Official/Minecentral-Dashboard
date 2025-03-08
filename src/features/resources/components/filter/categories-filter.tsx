'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCheckbox } from '@/components/ui/custom/custom-checkbox';
import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';
import { cn } from '@/lib/utils';

export default function PluginCategoriesFilter() {
  const [isOpen, setOpen] = useState(true);
  const { toggleCategory, categories } = usePluginFilterContext();
  return (
    <Card>
      <CardHeader
        className='ml-2 flex flex-row items-center justify-between px-4 py-3 hover:cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <CardTitle>Categories</CardTitle>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </CardHeader>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0'
        }`}
      >
        <CardContent className='w-full space-y-1 px-4'>
          {C_CategoriesPlugin.map((item) => (
            <CustomCheckbox
              key={item}
              label={item.charAt(0).toUpperCase() + item.slice(1)}
              onCheckedChange={() => {
                toggleCategory(item);
              }}
              checked={categories.includes(item)}
            />
          ))}
        </CardContent>
      </div>
    </Card>
  );
}
