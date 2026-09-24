import Link from 'next/link';
import { notFound } from 'next/navigation';

import { catalogService } from '@/features/catalog/queries/catalog-access';
import {
  workspaceActor,
  workspaceService,
} from '@/features/workspaces/queries/workspace-access';
import { canUseWorkspace } from '@/features/workspaces/services/workspace-policy';

export const instant = false;
export default async function ChooseWorkspace({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const result = await catalogService.detail(
    typeof query.projectId === 'string' ? query.projectId : '',
  );
  if (!result) notFound();
  const project = result.redirect ?? result.project;
  const actor = await workspaceActor();
  const list = await workspaceService.list(actor, false, Number(query.page));
  const accessible = await Promise.all(
    list.workspaces.map((w) => workspaceService.get(actor, w.id)),
  );
  const writable = accessible.filter((w) => canUseWorkspace(w.role, 'content'));
  const href = (page: number) =>
    `/servers/add-plugin?projectId=${project.id}&page=${page}`;
  return (
    <div className='mx-auto max-w-3xl space-y-6 p-6'>
      <h1 className='text-3xl font-semibold'>
        Add {project.name} to a workspace
      </h1>
      <p className='text-muted-foreground'>
        Choose where to record this plugin, then select its installed version.
      </p>
      <ul className='divide-y border-y'>
        {writable.map((w) => (
          <li key={w.id} className='py-4'>
            <Link
              href={`/servers/${w.id}/stack/add?projectId=${project.id}`}
              className='text-primary underline'
            >
              {w.name} · {w.platform} {w.minecraftVersion}
            </Link>
          </li>
        ))}
      </ul>
      {!writable.length && (
        <p>
          No editable workspaces on this page.{' '}
          <Link href='/servers/new' className='underline'>
            Create a workspace
          </Link>{' '}
          or browse another page.
        </p>
      )}
      <nav className='flex justify-between gap-4'>
        {list.page > 1 && <Link href={href(list.page - 1)}>← Previous</Link>}
        {list.hasNext && <Link href={href(list.page + 1)}>Next →</Link>}
      </nav>
    </div>
  );
}
