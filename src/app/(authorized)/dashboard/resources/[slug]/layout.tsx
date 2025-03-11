import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import ResourceEditTopbarTabs from '@/features/resources/components/dashboard/topbar-tabs.resource-edit';
import ResourceButtonPublish from '@/features/resources/components/resource/resource-button-publish';
import ResourceButtonSendToMod from '@/features/resources/components/resource/resource-button-send-to-mod';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectCanPublish } from '@/features/resources/queries/project-can-publish.boolean';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';
import validateRole from '@/lib/auth/helpers/validate-role';

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
      <div>
        <ResourceEditTopbarTabs {...resource} />
        <ResourceButtonSendToMod
          {...resource}
          canPublish={(await projectCanPublish(resource.id)).result}
        />
        {(await validateRole('admin')) && (
          <ResourceButtonPublish {...resource} />
        )}
      </div>
      {children}
    </div>
  );
}
