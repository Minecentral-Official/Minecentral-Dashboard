import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import ResourceEditTopbarTabs from '@/features/resources/components/dashboard/topbar-tabs.resource-edit';
import ResourceButtonPublish from '@/features/resources/components/resource/resource-button-publish';
import ResourceButtonSendToMod from '@/features/resources/components/resource/resource-button-send-to-mod';
import { projectGetById_WithUser } from '@/features/resources/queries/project-by-id-with-user.get';
import { projectCanPublish } from '@/features/resources/queries/project-can-publish.boolean';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import validateSession from '@/lib/auth/helpers/validate-session';

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

  if (!resource || !(await projectCanEdit(resource.id)))
    redirect('/dashboard/resources');

  return (
    <DashboardLayout>
      <div className='flex w-full flex-col gap-2'>
        <div>
          <ResourceEditTopbarTabs {...resource} />
          <ResourceButtonSendToMod
            {...resource}
            canPublish={(await projectCanPublish(resource.id)).result}
          />
          {hasPermission(
            (await validateSession()).user.role,
            'resources:moderate',
          ) && <ResourceButtonPublish {...resource} />}
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}
