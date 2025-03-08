import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import ResourceEditTopbarTabs from '@/features/resources/components/dashboard/topbar-tabs.resource-edit';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: PropsWithChildren & PageProps) {
  const { slug } = await params;

  const resource = await projectGetById_WithUser(
    (await projectGetIdBySlug(slug))!,
  );

  if (!resource) redirect('/dashboard/resources');

  return (
    <div className='flex w-full flex-col gap-2'>
      <ResourceEditTopbarTabs {...resource} />
      {children}
    </div>
  );
}
