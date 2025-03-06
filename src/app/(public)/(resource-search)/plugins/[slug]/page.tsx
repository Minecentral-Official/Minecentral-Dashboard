import ResourceCardCompatability from '@/features/resources/components/resource/cards/resource-compatability.card';
import ResourceCardContent from '@/features/resources/components/resource/cards/resource-content.card';
import ResourceCardCreators from '@/features/resources/components/resource/cards/resource-creators.card';
import ResourceCardLinks from '@/features/resources/components/resource/cards/resource-links.card';
import ResourceButtonHot from '@/features/resources/components/resource/resource-button-hot';
import ResourceHeader from '@/features/resources/components/resource/resource-header';
import resourceGetById_WithUser from '@/features/resources/queries/project-by-id-with-user.get';
import projectGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';
import getSession from '@/lib/auth/helpers/get-session';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const userResourceData = await resourceGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
    (await getSession())?.user.id,
  );

  if (!userResourceData) return <>Unable to find resource</>;

  return (
    <div className='mx-auto flex w-full flex-col gap-4 p-4'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <ResourceHeader {...userResourceData} />
          <div className='flex flex-row gap-2'>
            <ResourceButtonHot {...userResourceData} />
          </div>
        </div>
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
