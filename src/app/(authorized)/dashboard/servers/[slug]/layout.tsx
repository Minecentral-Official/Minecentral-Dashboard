import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import ServerEditTopbarTabs from '@/features/serverlist/components/ui/topbar-tabs.server-edit';
import { serverGetBySlug } from '@/features/serverlist/queries/server-by-slug.get';
import { serverMissingRequiredFields } from '@/features/serverlist/util/server-public-ready';
import validateSession from '@/lib/auth/helpers/validate-session';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: PropsWithChildren & PageProps) {
  const { slug } = await params;
  const { user } = await validateSession();

  const server = await serverGetBySlug(slug);

  if (!server || server.author.id !== user.id) redirect('/dashboard/servers');

  const missingRequiredFields = serverMissingRequiredFields(server);

  return (
    <div className='grid w-full gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]'>
      <div className='min-w-0'>
        <ServerEditTopbarTabs
          server={server}
          missingRequiredCount={missingRequiredFields.length}
        />
      </div>
      <div className='min-w-0 space-y-5 pb-8'>{children}</div>
    </div>
  );
}
