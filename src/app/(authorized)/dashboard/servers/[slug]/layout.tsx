import { PropsWithChildren } from 'react';

import { redirect } from 'next/navigation';

import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import { serverGetIdBySlug } from '@/features/serverlist/queries/server-get-id-by-slug.get';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Layout({
  children,
  params,
}: PropsWithChildren & PageProps) {
  const { slug } = await params;

  const server = await serverGetById((await serverGetIdBySlug(slug))!);

  if (!server) redirect('/dashboard/servers');

  return <div className='flex w-full flex-col gap-2'>{children}</div>;
}
