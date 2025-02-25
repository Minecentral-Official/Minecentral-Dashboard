import ResourceCardCompatability from '@/features/resources/components/resource/cards/resource-compatability.card';
import ResourceCardContent from '@/features/resources/components/resource/cards/resource-content.card';
import ResourceCardCreators from '@/features/resources/components/resource/cards/resource-creators.card';
import ResourceCardLinks from '@/features/resources/components/resource/cards/resource-links.card';
import ResourceButtonHot from '@/features/resources/components/resource/resource-button-hot';
import ResourceButtonSettings from '@/features/resources/components/resource/resource-button-settings';
import ResourceHeader from '@/features/resources/components/resource/resource-header';
import resourceGetById from '@/features/resources/queries/resource-by-id.get';
import getSession from '@/lib/auth/helpers/get-session';

type PageProps = {
  params: Promise<{ resourceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const userResourceData = await resourceGetById(
    resourceId,
    (await getSession())?.user.id,
  );

  if (!userResourceData) return <>Unable to find resource</>;

  return (
    <div className='mx-auto flex w-full flex-col gap-4 p-4'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
          <ResourceHeader {...userResourceData} />
          <div className='flex flex-row gap-2'>
            <ResourceButtonHot {...userResourceData} />
            <ResourceButtonSettings {...userResourceData} />
          </div>
        </div>
        {/* <ResourceUploader resourceId={plugin.id} /> */}
      </div>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <ResourceCardContent {...userResourceData} />
        <aside className='flex w-full flex-col gap-4 lg:max-w-60'>
          <ResourceCardCompatability {...userResourceData} />
          <ResourceCardLinks {...userResourceData} />
          <ResourceCardCreators {...userResourceData} />
        </aside>
      </div>
    </div>
  );
}
