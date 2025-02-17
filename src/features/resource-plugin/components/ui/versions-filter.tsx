'use client';

import { useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCheckbox } from '@/features/resource-plugin/components/ui/custom-checkbox';
import { TPluginVersions } from '@/features/resource-plugin/config/versions.plugin';
import { usePluginFilterContext } from '@/features/resource-plugin/context/plugin-filter.context';

export default function PluginVersionsFilter() {
  const [open, setOpen] = useState(true);
  const { toggleVersions, versions } = usePluginFilterContext();
  return (
    <Card>
      <CardHeader
        className='mb-2 ml-2 flex flex-row items-center justify-between px-4 py-4 hover:cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <CardTitle>Versions</CardTitle>
        {open ?
          <ChevronDownIcon className='h-4 w-4' />
        : <ChevronUpIcon className='h-4 w-4' />}
      </CardHeader>
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
    </Card>
  );
}
