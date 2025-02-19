import ResourcePageView from '@/features/resource-plugin/components/views/plugin-page.view';
import pluginGetById from '@/features/resource-plugin/queries/plugin-by-id.get';

type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const plugin = await pluginGetById(resourceId);

  return (
    <div className='pt-20'>
      {plugin ?
        <div className='pt-20'>
          <ResourcePageView {...plugin} />
        </div>
      : <>Requested Resource not found</>}
    </div>
  );
}
