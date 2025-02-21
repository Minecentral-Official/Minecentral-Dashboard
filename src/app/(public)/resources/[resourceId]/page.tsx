import ResourcePageView from '@/features/resource-plugin/components/views/plugin-page.view';
import pluginGetById from '@/features/resource-plugin/queries/plugin-by-id.get';

type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const plugin = await pluginGetById(resourceId);

  if (!plugin)
    return (
      <div className='w-full p-6 text-center text-lg'>
        Requested Resource not found
      </div>
    );

  return (
    <>
      <ResourcePageView {...plugin} />
    </>
  );
}
