import { Metadata } from 'next';

import PluginContent from '@/features/resources/components/filter/plugin-content';
import { PluginFilterProvider } from '@/features/resources/context/plugin-filter.context';

export const metadata: Metadata = {
  title: 'Plugins',
};

export default async function ContentPage() {
  return (
    <PluginFilterProvider>
      <div className='container mx-auto flex min-h-screen flex-col'>
        <PluginContent />
      </div>
    </PluginFilterProvider>
  );
}
