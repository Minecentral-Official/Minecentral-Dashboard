import ResourcePageView from '@/features/resource-plugin/components/views/plugin-page.view';
import { PluginProvider } from '@/features/resource-plugin/context/plugin.context';
import resourceGetById from '@/features/resource-plugin/queries/resource-by-id.get';

type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const plugin = await resourceGetById(resourceId);

  return (
    <div className='pt-20'>
      {plugin ?
        <PluginProvider {...plugin}>
          <div className='pt-20'>
            <ResourcePageView />
          </div>
        </PluginProvider>
      : <>Requested Resource not found</>}
    </div>
  );
}
