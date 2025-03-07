'use client';

import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomCheckbox } from '@/components/ui/custom/custom-checkbox';
import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';
import { cn } from '@/lib/utils';

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
        <ChevronDown className={cn('h-4 w-4 transition duration-300', isOpen && 'rotate-180')} />
      </CardHeader>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0'
          }`}
      >
        <CardContent className='h-48 w-full space-y-1 overflow-y-auto px-4'>
          {C_ResourceVersionSupport.map((item) => (
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
