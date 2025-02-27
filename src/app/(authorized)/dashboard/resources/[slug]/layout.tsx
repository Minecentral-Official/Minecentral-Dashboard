import { PropsWithChildren } from 'react';

import ResourceEditTopbarTabs from '@/features/resources/components/dashboard/topbar-tabs.resource-edit';
import resourceGetById_WithUser from '@/features/resources/queries/resource-by-id-with-user.get';
import resourceGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: PropsWithChildren & PageProps) {
  const { slug } = await params;

  const resource = await resourceGetById_WithUser((await resourceGetIdBySlug(slug))!);

  if (!resource) return <>Cant find it...</>;

  return (
    <div className='flex w-full flex-col gap-2'>
      <ResourceEditTopbarTabs {...resource} />
      {children}
    </div>
  );
}
