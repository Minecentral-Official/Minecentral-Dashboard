import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompatibilityStateBadge from '@/features/workspaces/components/compatibility-state';
import { workspaceSelectClass } from '@/features/workspaces/components/workspace-styles';
import { compatibilityService } from '@/features/workspaces/queries/compatibility-access';
import { stackService } from '@/features/workspaces/queries/stack-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function StackPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const result = await stackService.list(
    await workspaceActor(),
    workspaceId,
    await searchParams,
  );
  const compatibility = await compatibilityService.report(
    await workspaceActor(),
    workspaceId,
  );
  const editable =
    canUseWorkspace(workspace.role, 'content') && !workspace.archivedAt;
  const base = `/servers/${workspaceId}/stack`;
  const pageUrl = (page: number) =>
    `${base}?${new URLSearchParams({ q: result.q, state: result.state, sort: result.sort, page: String(page) })}`;
  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='font-mono text-xs uppercase tracking-widest text-primary'>
            Recorded on {workspace.platform} / {workspace.minecraftVersion}
          </p>
          <h2 className='mt-2 text-3xl font-semibold'>Plugin stack</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            {result.total} {result.total === 1 ? 'plugin' : 'plugins'} recorded
            · Changes here do not install or remove files on your server.
          </p>
        </div>
        {editable && (
          <div className='flex flex-wrap gap-3'>
            <Button asChild>
              <Link href={`${base}/add`}>Add plugin</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href={`${base}/import`}>Import stack</Link>
            </Button>
          </div>
        )}
      </header>
      <form className='grid items-end gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_10rem_11rem_auto]'>
        <label className='space-y-2 text-sm'>
          Search stack
          <Input
            name='q'
            defaultValue={result.q}
            placeholder='Plugin name or purpose'
            maxLength={150}
          />
        </label>
        <label className='space-y-2 text-sm'>
          State
          <select
            name='state'
            defaultValue={result.state}
            className={workspaceSelectClass}
          >
            <option value=''>All entries</option>
            <option value='enabled'>Enabled</option>
            <option value='disabled'>Disabled</option>
          </select>
        </label>
        <label className='space-y-2 text-sm'>
          Sort
          <select
            name='sort'
            defaultValue={result.sort}
            className={workspaceSelectClass}
          >
            <option value='name'>Plugin name</option>
            <option value='updated'>Last changed</option>
          </select>
        </label>
        <Button variant='outline'>Filter stack</Button>
      </form>
      <Link
        href={`/servers/${workspaceId}/compatibility`}
        className='inline-block text-sm text-primary underline'
      >
        View compatibility and dependency report
      </Link>
      {result.rows.length ?
        <ul className='divide-y border-y'>
          {result.rows.map(
            ({ entry, project, version, provider, latest, support }) => (
              <li
                key={entry.id}
                className='grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
              >
                <div className='min-w-0 border-l-2 border-primary/60 pl-4'>
                  <h3 className='break-words text-lg font-semibold'>
                    <Link
                      href={`${base}/${entry.id}`}
                      className='hover:underline'
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className='mt-1 break-words text-sm text-muted-foreground'>
                    {entry.alias || 'No purpose recorded'}
                  </p>
                  <p className='mt-2 text-xs'>
                    {entry.enabled ? 'Enabled' : 'Disabled'} ·{' '}
                    {entry.notes ? 'Private notes saved' : 'No private notes'}
                  </p>
                </div>
                <div className='min-w-0 text-sm'>
                  <CompatibilityStateBadge
                    state={
                      compatibility.report?.entries.find(
                        (e) => e.id === entry.id,
                      )?.state ?? 'unknown'
                    }
                  />
                  <p className='text-muted-foreground'>
                    Installed → latest with declared support
                  </p>
                  <p className='mt-1 break-words font-mono'>
                    {version?.name ?? entry.manualVersion ?? 'Unknown'} →{' '}
                    {latest?.name ?? 'Unknown'}
                  </p>
                  <p className='mt-2 text-xs text-muted-foreground'>
                    Recorded from {provider ?? entry.versionSource} · Latest:{' '}
                    {latest?.provider ?? 'no matching release'}
                  </p>
                  <p
                    className={`mt-1 text-xs ${support === 'unsupported' ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {support === 'unsupported' ?
                      'Warning: no declared support for this runtime.'
                    : support === 'declared' ?
                      'Publisher declares runtime support.'
                    : 'Runtime support unknown.'}
                    {version?.available === 0 ?
                      ' Recorded release is no longer available.'
                    : ''}
                  </p>
                </div>
                <Link
                  href={`${base}/${entry.id}`}
                  className='self-center text-sm text-primary underline underline-offset-4'
                >
                  {editable ? 'Edit entry' : 'View entry'}
                </Link>
              </li>
            ),
          )}
        </ul>
      : <section className='rounded-lg border border-dashed p-8'>
          <h3 className='text-xl font-semibold'>
            {result.total ? 'No matching entries' : 'Record your first plugin'}
          </h3>
          <p className='mt-3 text-muted-foreground'>
            {result.total ?
              'Clear your filters to see the whole stack.'
            : 'Add a catalog plugin or import a list from your existing server. You can record versions later.'
            }
          </p>
          <Link
            href={result.total ? base : `${base}/add`}
            className='mt-4 inline-block text-primary underline'
          >
            {result.total ? 'Clear filters' : 'Browse plugins'}
          </Link>
        </section>
      }
      <nav
        aria-label='Stack pages'
        className='flex flex-wrap justify-between gap-3 text-sm'
      >
        <span>
          {result.matching} matching · Page {result.page}
        </span>
        {result.page > 1 && (
          <Link href={pageUrl(result.page - 1)}>← Previous</Link>
        )}
        {result.hasNext && <Link href={pageUrl(result.page + 1)}>Next →</Link>}
      </nav>
    </div>
  );
}
