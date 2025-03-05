import { notFound } from 'next/navigation';

import PluginContent from '@/features/resources/components/filter/plugin-content';
import { PluginFilterProvider } from '@/features/resources/context/plugin-filter.context';

// Define valid content types
const validContentTypes = ['mods', 'plugins', 'resource-packs'];

export function generateStaticParams() {
  // Pre-render these routes at build time
  return validContentTypes.map((contentType) => ({
    contentType,
  }));
}

type PageParams = { params: Promise<{ contentType: string }> };

export default async function ContentPage({ params }: PageParams) {
  const { contentType } = await params;
  // Validate the content type
  if (!validContentTypes.includes(contentType)) {
    notFound();
  }
  return (
    <PluginFilterProvider>
      <div className='container mx-auto flex min-h-screen flex-col'>
        <PluginContent />
      </div>
    </PluginFilterProvider>
  );
}
