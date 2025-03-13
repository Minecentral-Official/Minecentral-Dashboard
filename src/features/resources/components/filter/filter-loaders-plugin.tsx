'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { CustomCheckbox } from '@/components/ui/custom/custom-checkbox';
import { C_PluginLoaders } from '@/features/resources/config/c-loaders.plugin';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';
import { pluginGetLoaderText } from '@/features/resources/util/plugin-loader-text.get';
import { cn } from '@/lib/utils';

export default function FilterLoaders_Plugin() {
  const [isOpen, setOpen] = useState(true);
  const { toggleLoaders, loaders } = usePluginFilterContext();
  return (
    <section>
      <div
        className='ml-2 flex flex-row items-center justify-between px-4 pb-3 hover:cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <p className='font-semibold'>Loaders</p>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0'
        }`}
      >
        <div className='h-48 w-full space-y-1 overflow-y-auto px-4'>
          {C_PluginLoaders.map((item) => (
            <CustomCheckbox
              key={item}
              onCheckedChange={() => {
                toggleLoaders(item);
              }}
              checked={loaders.includes(item)}
            >
              {pluginGetLoaderText(item)}
            </CustomCheckbox>
          ))}
        </div>
      </div>
    </section>
  );
}
