import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { catalogService } from '@/features/catalog/queries/catalog-access';
import { addStackAction } from '@/features/workspaces/actions/stack.actions';
import StackReleaseFilter from '@/features/workspaces/components/stack-release-filter';
import StackVersionFields from '@/features/workspaces/components/stack-version-fields';
import WorkspaceActionForm from '@/features/workspaces/components/workspace-action-form';
import { stackService } from '@/features/workspaces/queries/stack-access';
import {
  loadWorkspace,
  workspaceActor,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function AddPlugin({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId } = await params;
  const workspace = await loadWorkspace(workspaceId);
  const actor = await workspaceActor();
  const query = await searchParams;
  const base = `/servers/${workspaceId}/stack`;
  if (!canUseWorkspace(workspace.role, 'content') || workspace.archivedAt)
    return (
      <p>
        This workspace is read-only.{' '}
        <Link href={base} className='underline'>
          View stack
        </Link>
      </p>
    );
  if (typeof query.projectId === 'string') {
    const releases = await stackService.releases(
      actor,
      workspaceId,
      query.projectId,
      { all: query.all === 'true', page: Number(query.page) },
    );
    const href = (page: number, all = query.all === 'true') =>
      `${base}/add?${new URLSearchParams({ projectId: releases.project.id, all: String(all), page: String(page) })}`;
    return (
      <div className='max-w-2xl space-y-5'>
        <Link href={`${base}/add`} className='text-sm underline'>
          ← Search catalog
        </Link>
        <h2 className='text-2xl font-semibold'>Add {releases.project.name}</h2>
        <p className='text-sm text-muted-foreground'>
          {query.all === 'true' ?
            'All recorded releases, including unsupported and unavailable versions.'
          : `Releases declaring ${workspace.platform} / ${workspace.minecraftVersion} support.`
          }
        </p>
        <StackReleaseFilter
          all={query.all === 'true'}
          empty={!releases.rows.length}
          href={href(1, query.all !== 'true')}
        />
        <WorkspaceActionForm
          action={addStackAction.bind(null, workspaceId, releases.project.id)}
          label='Add to stack'
        >
          <StackVersionFields releases={releases.rows} />
        </WorkspaceActionForm>
        <nav className='flex justify-between gap-4'>
          {releases.page > 1 && (
            <Link href={href(releases.page - 1)}>← Newer releases</Link>
          )}
          {releases.hasNext && (
            <Link href={href(releases.page + 1)}>Older releases →</Link>
          )}
        </nav>
      </div>
    );
  }
  const result = await catalogService.search(query);
  return (
    <div className='space-y-5'>
      <Link href={base} className='text-sm underline'>
        ← Plugin stack
      </Link>
      <h2 className='text-2xl font-semibold'>Add a plugin</h2>
      <form className='flex flex-wrap gap-3'>
        <Input
          aria-label='Search catalog'
          name='q'
          defaultValue={result.filters.q}
          placeholder='Search plugin names and descriptions'
          className='max-w-md'
        />
        <Button>Search catalog</Button>
      </form>
      <ul className='divide-y border-y'>
        {result.projects.map((p) => (
          <li
            key={p.id}
            className='flex items-center justify-between gap-4 py-4'
          >
            <div className='min-w-0'>
              <h3 className='break-words font-semibold'>{p.name}</h3>
              <p className='line-clamp-2 text-sm text-muted-foreground'>
                {p.description}
              </p>
            </div>
            <Link
              href={`${base}/add?projectId=${p.id}`}
              className='shrink-0 text-sm text-primary underline'
            >
              Choose plugin<span className='sr-only'> {p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {!result.projects.length && (
        <p>
          No matching plugins. Try another search or ask a curator to add the
          project.
        </p>
      )}
      <nav className='flex justify-between gap-3'>
        {result.filters.page > 1 && (
          <Link
            href={`${base}/add?q=${encodeURIComponent(result.filters.q)}&page=${result.filters.page - 1}`}
          >
            ← Previous
          </Link>
        )}
        {result.hasNext && (
          <Link
            href={`${base}/add?q=${encodeURIComponent(result.filters.q)}&page=${result.filters.page + 1}`}
          >
            Next →
          </Link>
        )}
      </nav>
    </div>
  );
}
