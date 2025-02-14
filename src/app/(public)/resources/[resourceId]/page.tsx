import ResourcePageView from '@/features/resource/components/views/plugin-page.view';
import { ResourcePluginProvider } from '@/features/resource/context/plugin.context';
import resourceGetById from '@/features/resource/queries/resource-by-id.get';

type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const plugin = await resourceGetById(resourceId);
  if (!plugin) return <>Huh</>;

  return (
    <ResourcePluginProvider plugin={plugin}>
      <div className='pt-20'>
        <ResourcePageView />
      </div>
    </ResourcePluginProvider>
  );
}
