import { PropsWithChildren } from 'react';

import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';
import ResourceCardCompatability from '@/features/resources/components/resource/cards/resource-compatability.card';
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

export default async function layout({
  params,
  children,
}: PropsWithChildren & PageProps) {
  const { slug } = await params;
  const userResourceData = await projectGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
    (await getSession())?.user.id,
  );

  if (!userResourceData) return <>Unable to find resource</>;
  return (
    <PluginFilterProvider>
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2'>
          {children}
        </div>
        <div className='flex flex-col gap-4'>
          <ResourceButtonHot {...userResourceData} />
          <ResourceHeader {...userResourceData} />
        </div>
      </div>
      <ResourceCardCompatability {...userResourceData} />
      <ResourceCardLinks {...userResourceData} />
      <ResourceCardCreators {...userResourceData} />





    </PluginFilterProvider>
  );
}
