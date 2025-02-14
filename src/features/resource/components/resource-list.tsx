'use client';

import ResourceCard from '@/features/resource/components/card/resource.card';
import { useResourcePluginContext } from '@/features/resource/context/plugin.context';

export default function ResourceList() {
  const { plugins } = useResourcePluginContext();
  return (
    <div className='grid grid-cols-2 gap-4'>
      {plugins.map(({ id }, index) => (
        <ResourceCard key={index} resourceId={id} />
      ))}
    </div>
  );
}
