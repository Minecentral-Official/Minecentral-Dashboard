import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import ServerEditTopbarTabs from '@/features/serverlist/components/ui/topbar-tabs.server-edit';
import { serverGetBySlug } from '@/features/serverlist/queries/server-by-slug.get';
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

  return (
    <div className='flex w-full flex-col gap-2'>
      <div>
        <ServerEditTopbarTabs {...server} />
      </div>
      {children}
    </div>
  );
}
