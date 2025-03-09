import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';
import ResourceCardCompatability from '@/features/resources/components/resource/cards/resource-compatability.card';
import ResourceCardContent from '@/features/resources/components/resource/cards/resource-content.card';
import ResourceCardCreators from '@/features/resources/components/resource/cards/resource-creators.card';
import ResourceCardLinks from '@/features/resources/components/resource/cards/resource-links.card';
import ResourceButtonHot from '@/features/resources/components/resource/resource-button-hot';
import ResourceHeader from '@/features/resources/components/resource/resource-header';
import { PluginFilterProvider } from '@/features/resources/context/plugin-filter.context';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';
import getSession from '@/lib/auth/helpers/get-session';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const userResourceData = await projectGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
    (await getSession())?.user.id,
  );

  if (!userResourceData) return <>Unable to find resource</>;

  return (
    <PluginFilterProvider>
      <SidebarWrapper
        // Undo sticky sidebar for this page
        className='relative top-0'
        sidebar={
          <div className='flex h-full flex-col justify-start gap-4 pt-2'>
            <ResourceCardCompatability {...userResourceData} />
            <Separator />
            <ResourceCardLinks {...userResourceData} />
            <Separator />
            <ResourceCardCreators {...userResourceData} />
          </div>
        }
      >
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
          </div>
        </div>
      </SidebarWrapper>
    </PluginFilterProvider>
  );
}
