import { ArrowUpRight, Plus, Server } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  workspaceActor,
  workspaceService,
} from '@/features/workspaces/queries/workspace-access';

export default async function MyServers({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const archived = params.archived === 'true';
  const result = await workspaceService.list(
    await workspaceActor(),
    archived,
    Number(params.page ?? 1),
  );
  const href = (page: number) => `/servers?archived=${archived}&page=${page}`;
  return (
    <main className='space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-primary'>
            Server workspaces
          </p>
          <h1 className='text-3xl font-semibold tracking-tight'>My Servers</h1>
          <p className='mt-2 max-w-xl text-muted-foreground'>
            Keep each server’s runtime, notes and team in one place.
          </p>
        </div>
        <Button asChild>
          <Link href='/servers/new'>
            <Plus aria-hidden='true' />
            Create workspace
          </Link>
        </Button>
      </div>
      <nav aria-label='Workspace list' className='flex gap-4 border-b pb-3'>
        <Link
          href='/servers'
          aria-current={!archived ? 'page' : undefined}
          className={
            !archived ? 'font-semibold text-primary' : 'text-muted-foreground'
          }
        >
          Active workspaces
        </Link>
        <Link
          href='/servers?archived=true'
          aria-current={archived ? 'page' : undefined}
          className={
            archived ? 'font-semibold text-primary' : 'text-muted-foreground'
          }
        >
          Archived
        </Link>
      </nav>
      {result.workspaces.length ?
        <div className='grid gap-4 md:grid-cols-2'>
          {result.workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/servers/${workspace.id}`}
              className='group rounded-lg border bg-card p-5 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-xs capitalize text-muted-foreground'>
                    {workspace.archivedAt ? 'Archived' : workspace.status} ·{' '}
                    {workspace.visibility === 'team' ?
                      'Shared with team'
                    : 'Private'}
                  </p>
                  <h2 className='mt-2 break-words text-xl font-semibold'>
                    {workspace.name}
                  </h2>
                </div>
                <ArrowUpRight
                  aria-hidden='true'
                  className='size-5 shrink-0 text-muted-foreground group-hover:text-primary'
                />
              </div>
              <p className='my-4 rounded-md border-l-2 border-primary bg-background px-3 py-2 font-mono text-xs'>
                Paper / {workspace.minecraftVersion} /{' '}
                {workspace.javaVersion ?
                  `Java ${workspace.javaVersion}`
                : 'Java not recorded'}
              </p>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <p>
                  <span className='block text-muted-foreground'>Plugins</span>
                  Not configured
                </p>
                <p>
                  <span className='block text-muted-foreground'>
                    Compatibility warnings
                  </span>
                  Not checked
                </p>
              </div>
              <p className='mt-4 border-t pt-3 text-xs text-muted-foreground'>
                Last activity ·{' '}
                {workspace.updatedAt
                  .toISOString()
                  .slice(0, 16)
                  .replace('T', ' ')}{' '}
                UTC
              </p>
            </Link>
          ))}
        </div>
      : <div className='rounded-lg border border-dashed px-6 py-14 text-center'>
          <Server
            aria-hidden='true'
            className='mx-auto mb-4 size-9 text-muted-foreground'
          />
          <h2 className='text-xl font-semibold'>
            {archived ?
              'No archived workspaces'
            : 'Start with your first server'}
          </h2>
          <p className='mx-auto mb-6 mt-2 max-w-md text-muted-foreground'>
            {archived ?
              'Archived workspaces stay available here until you restore or delete them.'
            : 'Save a name and runtime now. You can add notes and teammates once your workspace is ready.'
            }
          </p>
          <Button asChild>
            <Link href={archived ? '/servers' : '/servers/new'}>
              {archived ? 'View active workspaces' : 'Create workspace'}
            </Link>
          </Button>
        </div>
      }
      <nav
        aria-label='Workspace pages'
        className='flex justify-between text-sm'
      >
        {result.page > 1 ?
          <Link href={href(result.page - 1)}>← Previous</Link>
        : <span />}
        {result.hasNext && <Link href={href(result.page + 1)}>Next →</Link>}
      </nav>
    </main>
  );
}

// Private workspace data is authorized at request time; loading.tsx supplies navigation feedback.
export const instant = false;
