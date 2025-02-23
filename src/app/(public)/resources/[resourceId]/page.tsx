import ResourceUploader from '@/features/resource-plugin/components/forms/upload-resource.form';
import ResourceCompatability from '@/features/resource-plugin/components/resource/resource-compatability';
import ResourceContent from '@/features/resource-plugin/components/resource/resource-content';
import ResourceEditButtons from '@/features/resource-plugin/components/resource/resource-edit-buttons';
import ResourceHeader from '@/features/resource-plugin/components/resource/resource-header';
import ResourceHotButtons from '@/features/resource-plugin/components/resource/resource-hot-buttons';
import ResourceLinks from '@/features/resource-plugin/components/resource/resource-links';
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
    <div className='mx-auto flex w-full flex-row gap-4 p-4'>
      <div className='flex w-full flex-col gap-4'>
        <ResourceHeader {...plugin} />
        <ResourceHotButtons {...plugin} />
        <ResourceContent {...plugin} />
        <ResourceUploader resourceId={plugin.id} />
      </div>
      <aside className='w-full max-w-60 space-y-2'>
        <ResourceCompatability {...plugin} />
        <ResourceLinks {...plugin} />
        <ResourceEditButtons {...plugin} />
      </aside>
    </div>
  );
}
