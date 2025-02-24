'use client';

import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCheckbox } from '@/components/ui/custom/custom-checkbox';
import { TPluginVersions } from '@/features/resource-plugin/config/versions.plugin';
import { usePluginFilterContext } from '@/features/resource-plugin/context/plugin-filter.context';

export default function PluginVersionsFilter() {
  const [isOpen, setOpen] = useState(true);
  const { toggleVersions, versions } = usePluginFilterContext();
  return (
    <Card>
      <CardHeader
        className='ml-2 flex flex-row items-center justify-between px-4 py-3 hover:cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <CardTitle>Versions</CardTitle>
        {isOpen ?
          <ChevronUp className='h-4 w-4' />
        : <ChevronDown className='h-4 w-4' />}
      </CardHeader>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0'
        }`}
      >
        <CardContent className='h-48 w-full space-y-1 overflow-y-auto px-4'>
          {TPluginVersions.map((item) => (
            <CustomCheckbox
              key={item}
              label={item.charAt(0).toUpperCase() + item.slice(1)}
              onCheckedChange={() => {
                toggleVersions(item);
              }}
              checked={versions.includes(item)}
            />
          ))}
        </CardContent>
      </div>
    </Card>
  );
}
