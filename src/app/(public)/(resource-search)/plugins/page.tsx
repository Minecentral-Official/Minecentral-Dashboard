import { Metadata } from 'next';

import PluginContent from '@/features/resources/components/filter/plugin-content';

export const metadata: Metadata = {
  title: 'Plugins',
};

export default async function ContentPage() {
  return (
    <div className='mx-auto flex min-h-screen w-full'>
      <PluginContent />
    </div>
  );
}
