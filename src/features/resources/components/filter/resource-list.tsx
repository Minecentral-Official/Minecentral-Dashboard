'use client';

import PluginCardView from '@/features/resources/components/resource/cards/plugin-view.card';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';

export default function ResourceList() {
  const { plugins } = usePluginFilterContext();
  return (
    <>
      {plugins ?
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3'>
          {plugins.map((plugin, index) => (
            <PluginCardView key={index} {...plugin} />
          ))}
        </div>
      : <p className='mx-auto'>No resources found</p>}
    </>
  );
}
